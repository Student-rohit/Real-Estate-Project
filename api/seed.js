import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// ── Models ────────────────────────────────────────────────────────────────────
import Listing from './models/listing.model.js';
import User from './models/user.model.js';

await mongoose.connect(process.env.MONGO_URI);
console.log('✅ Connected to MongoDB');

// ── Create / reuse demo user ──────────────────────────────────────────────────
const email = 'demo@mern-estate.com';
let user = await User.findOne({ email });
if (!user) {
    const hash = bcryptjs.hashSync('demo1234', 10);
    user = await User.create({ username: 'DemoUser', email, password: hash });
    console.log('👤 Demo user created:', email);
} else {
    console.log('👤 Reusing existing user:', email);
}

const userId = user._id.toString();

// ── Sample listings ───────────────────────────────────────────────────────────
const listings = [
    {
        name: 'Luxury Downtown Apartment',
        description: 'Stunning fully-furnished luxury apartment in the heart of the city with panoramic views.',
        address: '12 MG Road, Bengaluru, Karnataka',
        regularPrice: 85000,
        discountPrice: 75000,
        bathrooms: 2,
        bedrooms: 3,
        furnished: true,
        parking: true,
        type: 'rent',
        offer: true,
        imageUrls: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        ],
        userRef: userId,
    },
    {
        name: 'Modern Villa with Garden',
        description: 'Spacious modern villa with a private garden, swimming pool and 3-car garage.',
        address: '45 Jubilee Hills, Hyderabad, Telangana',
        regularPrice: 12000000,
        discountPrice: 10500000,
        bathrooms: 4,
        bedrooms: 5,
        furnished: true,
        parking: true,
        type: 'sale',
        offer: true,
        imageUrls: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        userRef: userId,
    },
    {
        name: 'Cozy Studio Near University',
        description: 'Affordable cozy studio apartment, perfect for students. Close to metro and market.',
        address: '7 Anna Nagar, Chennai, Tamil Nadu',
        regularPrice: 12000,
        discountPrice: 10000,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: true,
        imageUrls: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        ],
        userRef: userId,
    },
    {
        name: 'Penthouse with Rooftop Pool',
        description: 'Exclusive penthouse on the 30th floor with a private rooftop infinity pool and gym.',
        address: '89 Bandra West, Mumbai, Maharashtra',
        regularPrice: 35000000,
        discountPrice: 35000000,
        bathrooms: 3,
        bedrooms: 4,
        furnished: true,
        parking: true,
        type: 'sale',
        offer: false,
        imageUrls: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        ],
        userRef: userId,
    },
    {
        name: 'Family Home in Quiet Suburb',
        description: 'Lovely 3-bedroom family home in a peaceful gated community with park access.',
        address: '22 Whitefield, Bengaluru, Karnataka',
        regularPrice: 5500000,
        discountPrice: 5200000,
        bathrooms: 2,
        bedrooms: 3,
        furnished: false,
        parking: true,
        type: 'sale',
        offer: true,
        imageUrls: [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ],
        userRef: userId,
    },
    {
        name: 'Furnished 2BHK Near Metro',
        description: 'Fully furnished 2BHK apartment, 5 min walk from metro station. Perfect for professionals.',
        address: '3 Sector 62, Noida, Uttar Pradesh',
        regularPrice: 28000,
        discountPrice: 25000,
        bathrooms: 2,
        bedrooms: 2,
        furnished: true,
        parking: true,
        type: 'rent',
        offer: true,
        imageUrls: [
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
        ],
        userRef: userId,
    },
];

// Clear old seed listings (optional — comment out to keep existing data)
await Listing.deleteMany({ userRef: userId });
console.log('🗑️  Cleared previous seed listings');

await Listing.insertMany(listings);
console.log(`🏠 Inserted ${listings.length} sample listings!`);

await mongoose.disconnect();
console.log('\n✅ Done! Open http://localhost:5173/search to see your listings.');
process.exit(0);
