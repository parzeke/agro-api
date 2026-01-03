import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/config/models/Products.js';
import Category from './src/config/models/Category.js';
import connectDB from './src/config/db.js';

dotenv.config();

const API_URL = "http://192.168.1.5:5000";

const products = [
    { name: "Cesta de Frutas Orgánicas", price: 25, weight: 2, weightUnit: "kg", stock: 10, categoryName: "Frutas", image: `${API_URL}/uploads/frutas.png`, description: "Selección de las mejores frutas de temporada.", location: "Valencia" },
    { name: "Verduras Frescas", price: 15, weight: 1.5, weightUnit: "kg", stock: 15, categoryName: "Verduras", image: `${API_URL}/uploads/verduras.png`, description: "Verduras recién cosechadas de la huerta.", location: "Almería" },
    { name: "Pack Lácteos Artesanales", price: 18, weight: 1, weightUnit: "kg", stock: 8, categoryName: "Lácteos", image: `${API_URL}/uploads/lacteos.png`, description: "Leche, queso y yogurt artesanal.", location: "Asturias" },
    { name: "Corte de Carne Premium", price: 35, weight: 1, weightUnit: "kg", stock: 5, categoryName: "Carnes", image: `${API_URL}/uploads/carnes.png`, description: "Cortes de carne de pasto de alta calidad.", location: "Ávila" },
    { name: "Cesta Variada Sorpresa", price: 40, weight: 5, weightUnit: "kg", stock: 3, categoryName: "Cestas Variadas", image: `${API_URL}/uploads/cestas.png`, description: "Una mezcla perfecta de todo lo bueno.", location: "Madrid" },
    { name: "Miel y Hierbas", price: 12, weight: 0.5, weightUnit: "kg", stock: 20, categoryName: "Salud y otros", image: `${API_URL}/uploads/salud.png`, description: "Productos para tu bienestar natural.", location: "Granada" },
];

const seed = async () => {
    await connectDB();

    // Delete all products
    await Product.deleteMany({});
    console.log("Deleted all products.");

    const categories = await Category.find({});

    for (const p of products) {
        const cat = categories.find(c => c.name === p.categoryName);
        if (cat) {
            await Product.create({
                ...p,
                category: cat._id,
                seller: null // Letting it be null or handled by backend if required. 
                // Ideally should assign to a user if `seller` is required.
                // Assuming schema doesn't strictly require it or it's nullable.
            });
            console.log(`Created product: ${p.name}`);
        } else {
            console.log(`Category not found: ${p.categoryName}`);
        }
    }

    console.log("Seeding done.");
    process.exit();
};

seed();
