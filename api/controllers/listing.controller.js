import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import { deleteFileFromCloudinary } from '../utils/cloudinary.js';

export const createListing = async (req, res, next) => {
  try {
    const suspiciousKeywords = ['test', 'fake', 'spam', 'dummy', 'asdf'];
    const { name, description, regularPrice } = req.body;
    
    let flagged = false;
    const combinedText = `${name} ${description}`.toLowerCase();
    
    if (suspiciousKeywords.some(keyword => combinedText.includes(keyword))) {
      flagged = true;
    }

    if (regularPrice < 100 || regularPrice > 1000000000) {
      flagged = true;
    }

    const listing = await Listing.create({ ...req.body, flagged });
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    if (listing.imageUrls && listing.imageUrls.length > 0) {
      for (const url of listing.imageUrls) {
        await deleteFileFromCloudinary(url);
      }
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    if (req.body.imageUrls) {
      const imagesToRemove = listing.imageUrls.filter(url => !req.body.imageUrls.includes(url));
      for (const url of imagesToRemove) {
        await deleteFileFromCloudinary(url);
      }
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 100000000;

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
      regularPrice: { $gte: minPrice, $lte: maxPrice },
      approved: true,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
