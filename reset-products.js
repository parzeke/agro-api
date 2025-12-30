import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/config/models/Products.js';
import User from './src/config/models/user.js';
import Category from './src/config/models/Category.js';

dotenv.config();

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agro-app');
        console.log('Connected to MongoDB...');

        // Delete all products
        await Product.deleteMany({});
        console.log('All products deleted.');

        // Get all users
        const users = await User.find();
        if (users.length === 0) {
            console.log('No users found. Please register some users first.');
            process.exit();
        }

        // Get a category
        const category = await Category.findOne() || { _id: null };

        // Create 1 product for each user
        const products = users.map((user, index) => ({
            name: `Producto de ${user.name}`,
            price: 1000 + (index * 500),
            description: `Esta es una descripción de prueba para el producto de ${user.name}.`,
            location: 'Iringa, Tanzania',
            image: 'https://via.placeholder.com/305',
            category: category._id,
            seller: user._id
        }));

        await Product.insertMany(products);
        console.log(`Created ${products.length} new products (1 per user).`);

        process.exit();
    } catch (error) {
        console.error('Error resetting DB:', error);
        process.exit(1);
    }
};

resetDB();
