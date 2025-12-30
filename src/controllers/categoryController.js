import Category from '../config/models/Category.js';

// Seed categories if they don't exist
const seedCategories = async () => {
    const predefinedCategories = [
        "Frutas",
        "Verduras",
        "Lácteos",
        "Carnes",
        "Cestas Variadas",
        "Salud y otros"
    ];

    try {
        const count = await Category.countDocuments();
        if (count === 0) {
            const categoriesToCreate = predefinedCategories.map(name => ({ name }));
            await Category.insertMany(categoriesToCreate);
            console.log("Categories seeded successfully");
        }
    } catch (error) {
        console.error("Error seeding categories:", error);
    }
};

// Initial seeding
seedCategories();

export const getCategories = async (req, res) => {
    console.log("GET /api/categories request received");
    try {
        const categories = await Category.find();
        console.log("Fetched categories count:", categories.length);
        res.json(categories);
    } catch (error) {
        console.error("Error in getCategories:", error.message);
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const newCategory = new Category({ name, image });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, image },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};
