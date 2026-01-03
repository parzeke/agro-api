import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/config/models/Products.js';
import User from './src/config/models/user.js';
import connectDB from './src/config/db.js';

dotenv.config();

const assignRandomSellers = async () => {
    try {
        await connectDB();

        const users = await User.find({});
        if (users.length === 0) {
            console.error("No users found in database. Cannot assign sellers.");
            process.exit(1);
        }

        const products = await Product.find({});
        console.log(`Found ${products.length} products and ${users.length} users.`);

        for (const product of products) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            product.seller = randomUser._id;
            await product.save();
            console.log(`Product "${product.name}" assigned to seller: "${randomUser.name}"`);
        }

        console.log("All products have been assigned to random sellers.");
        process.exit(0);
    } catch (error) {
        console.error("Error assigned sellers:", error);
        process.exit(1);
    }
};

assignRandomSellers();
