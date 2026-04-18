import express from 'express';
import { addMoney, buyProperty, getTransactions } from '../controllers/wallet.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/add', verifyToken, addMoney);
router.post('/buy', verifyToken, buyProperty);
router.get('/transactions', verifyToken, getTransactions);

export default router;
