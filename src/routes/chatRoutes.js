import express from "express";
import { sendMessage, getChatHistory, getUserConversations } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/history/:userId/:productId", protect, getChatHistory);
router.get("/conversations", protect, getUserConversations);

export default router;
