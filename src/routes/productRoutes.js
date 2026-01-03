import express from "express";
import { createProduct, getProducts, deleteProduct, getProductById, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.delete("/:id", deleteProduct); // <--- DELETE
router.put("/:id", updateProduct); // <--- UPDATE

console.log("✅ Product routes loaded");

export default router;
