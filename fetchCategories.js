import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/config/models/Category.js';
import connectDB from './src/config/db.js';

dotenv.config();

const run = async () => {
    await connectDB();
    const categories = await Category.find({});
    fs.writeFileSync('categories_clean.json', JSON.stringify(categories, null, 2));
    console.log("Done");
    process.exit();
};

run();
