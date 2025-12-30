import express from "express";
import { createProduct, getProducts, deleteProduct, getProductById } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.delete("/:id", deleteProduct); // <--- DELETE

console.log("✅ Product routes loaded");

export default router;
