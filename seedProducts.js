import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/config/models/Products.js';
import Category from './src/config/models/Category.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Delete all products
        await Product.deleteMany({});
        console.log('All products deleted');

        // 2. Get all categories
        const categories = await Category.find();

        // 3. Create one product for each category
        const productsToSeed = categories.map(cat => ({
            name: `${cat.name} de la Huerta`,
            price: Math.floor(Math.random() * 5000) + 1000,
            description: `Este es un producto de alta calidad de la categoría ${cat.name}.`,
            location: "Valencia",
            image: "https://via.placeholder.com/305?text=Sin+Foto",
            category: cat._id
        }));

        await Product.insertMany(productsToSeed);
        console.log(`${productsToSeed.length} products seeded successfully`);

        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
