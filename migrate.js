import mongoose from 'mongoose';
import User from './src/config/models/user.js';
import Category from './src/config/models/Category.js';
import Product from './src/config/models/Products.js';
import Message from './src/config/models/Message.js';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/agriapp';
const REMOTE_URI = 'mongodb+srv://albertocnp:albertocnp@agro-app.fq7g7xx.mongodb.net/agriapp?retryWrites=true&w=majority';

async function migrate() {
    try {
        console.log('--- Phase 1: Reading Local Data ---');
        await mongoose.connect(LOCAL_URI);
        console.log('Connected to Local DB');

        const users = await User.find().lean();
        const categories = await Category.find().lean();
        const products = await Product.find().lean();
        const messages = await Message.find().lean();

        console.log(`Found: ${users.length} users, ${categories.length} categories, ${products.length} products, ${messages.length} messages.`);
        await mongoose.disconnect();

        console.log('\n--- Phase 2: Writing to Atlas Cloud ---');
        await mongoose.connect(REMOTE_URI);
        console.log('Connected to Atlas Cloud');

        // Clear remote collections first to avoid duplicates/conflicts
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Message.deleteMany({});

        if (users.length > 0) await User.insertMany(users);
        if (categories.length > 0) await Category.insertMany(categories);
        if (products.length > 0) await Product.insertMany(products);
        if (messages.length > 0) await Message.insertMany(messages);

        console.log('Data migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
