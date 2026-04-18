import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const addMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return next(errorHandler(400, 'Invalid amount'));
    }

    const user = await User.findById(req.user.id);
    user.walletBalance += amount;
    await user.save();

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount,
      type: 'credit',
      description: 'Added money to wallet',
    });

    res.status(200).json({ walletBalance: user.walletBalance, transaction });
  } catch (error) {
    next(error);
  }
};

export const buyProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const buyerId = req.user.id;

    const property = await Listing.findById(propertyId);
    if (!property) return next(errorHandler(404, 'Property not found'));

    if (property.userRef === buyerId) {
      return next(errorHandler(400, 'You cannot buy your own property'));
    }

    const buyer = await User.findById(buyerId);
    const seller = await User.findById(property.userRef);

    const price = property.offer ? property.discountPrice : property.regularPrice;

    // Mock direct gateway payment: no wallet balance check required
    // if (buyer.walletBalance < price) {
    //   return next(errorHandler(400, 'Insufficient balance in wallet'));
    // }

    // Deduct from buyer
    buyer.walletBalance -= price;
    await buyer.save();

    await Transaction.create({
      userId: buyerId,
      amount: price,
      type: 'debit',
      propertyId: property._id,
      description: `Bought property: ${property.name}`,
    });

    // Credit to seller
    seller.walletBalance += price;
    await seller.save();

    await Transaction.create({
      userId: seller._id,
      amount: price,
      type: 'credit',
      propertyId: property._id,
      description: `Sold property: ${property.name}`,
    });

    res.status(200).json({ success: true, message: 'Property bought successfully', walletBalance: buyer.walletBalance });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
