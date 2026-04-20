import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import adminRouter from './routes/admin.route.js';
import walletRouter from './routes/wallet.route.js';
import chatbotRouter from './routes/chatbot.route.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

// Connect to Database
if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in Render environment variables!");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('--- SUCCESS: Connected to MongoDB! ---');
    })
    .catch((err) => {
      console.error('--- DATABASE CONNECTION ERROR ---');
      console.error(err.message);
    });
}

// Port Listening - DO THIS FIRST so Render sees the app is alive
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// API Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/chatbot', chatbotRouter);

// Frontend Hosting
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({ success: false, statusCode, message });
});
