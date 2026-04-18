import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@mern-estate.com';
    let user = await User.findOne({ email });
    
    if (!user) {
        const hash = bcryptjs.hashSync('admin123', 10);
        user = await User.create({ 
            username: 'Admin', 
            email, 
            password: hash,
            role: 'admin',
            avatar: 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png'
        });
        console.log('👑 Admin user created:', email, '/ admin123');
    } else {
        user.role = 'admin';
        await user.save();
        console.log('👑 Reused and updated existing user to Admin:', email);
    }

    await mongoose.disconnect();
    process.exit(0);
}

createAdmin();
