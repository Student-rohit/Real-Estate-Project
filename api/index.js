import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import adminRouter from './routes/admin.route.js';
import walletRouter from './routes/wallet.route.js';
import chatbotRouter from './routes/chatbot.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname_env = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname_env, '.env') });

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(cookieParser());

server.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port ' + (process.env.PORT || 3000));
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/chatbot', chatbotRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
