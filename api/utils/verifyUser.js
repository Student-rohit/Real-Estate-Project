import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    req.user = user;
    next();
  });
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const User = (await import('../models/user.model.js')).default;
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return next(errorHandler(403, 'Forbidden: Admin access required'));
    }
    next();
  } catch (error) {
    next(error);
  }
};
