import express from "express";
import { getUsers, getUserById, getUsersWithLocation } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/with-location", getUsersWithLocation);
router.get("/:id", getUserById);

export default router;
