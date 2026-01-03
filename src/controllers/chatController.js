import Message from "../config/models/Message.js";

export const sendMessage = async (req, res) => {
    try {
        const { receiver, product, content } = req.body;
        const sender = req.user.id; // From auth middleware

        console.log(`Sending message from ${sender} to ${receiver} for product ${product}`);

        if (!receiver || !product || !content) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const message = await Message.create({
            sender,
            receiver,
            product,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        console.error("Error sending message detail:", error);
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const currentUserId = req.user.id;
        const mongoose = (await import('mongoose')).default;

        console.log(`Fetching chat history: User=${userId}, Product=${productId}, CurrentUser=${currentUserId}`);

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            console.log('Invalid IDs provided');
            return res.status(400).json({ message: "Invalid user or product ID" });
        }

        const messages = await Message.find({
            product: productId,
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching chat history detail:", error);
        res.status(500).json({ message: "Error fetching chat history", error: error.message });
    }
};

export const getUserConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`Fetching conversations for user: ${userId}`);

        // Find all unique conversations for the user
        // This is a simplified version
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar')
            .populate('product', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching conversations detail:", error);
        res.status(500).json({ message: "Error fetching conversations", error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const currentUserId = req.user.id;

        await Message.updateMany(
            {
                sender: userId,
                receiver: currentUserId,
                product: productId,
                read: false
            },
            { $set: { read: true } }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error marking messages as read" });
    }
};
