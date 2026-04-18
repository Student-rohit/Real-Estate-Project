import express from 'express';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
import { errorHandler } from '../utils/error.js';

const router = express.Router();

router.get('/users', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found'));
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
});

router.get('/listings/pending', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const listings = await Listing.find({ approved: false }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
});

router.put('/listings/approve/:id', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!listing) return next(errorHandler(404, 'Listing not found'));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
});

router.get('/listings/all', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
});

router.delete('/listings/:id', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, 'Listing not found'));
    
    // If listing has images, we might want to delete them from firebase, 
    // but for now let's just delete the DB record to keep it simple or 
    // reuse listing.controller's logic if possible.
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted');
  } catch (error) {
    next(error);
  }
});

router.post('/listings/auto-clean', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const suspiciousKeywords = ['test', 'fake', 'spam', 'dummy', 'asdf'];
    const result = await Listing.deleteMany({
      $or: [
        { name: { $regex: suspiciousKeywords.join('|'), $options: 'i' } },
        { description: { $regex: suspiciousKeywords.join('|'), $options: 'i' } },
        { regularPrice: { $lt: 100 } } // Extremely low price
      ]
    });
    res.status(200).json(`${result.deletedCount} suspicious listings removed automatically`);
  } catch (error) {
    next(error);
  }
});

export default router;
