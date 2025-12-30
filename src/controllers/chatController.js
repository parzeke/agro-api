import Message from "../config/models/Message.js";

export const sendMessage = async (req, res) => {
    try {
        const { receiver, product, content } = req.body;
        const sender = req.user.id; // From auth middleware

        const message = await Message.create({
            sender,
            receiver,
            product,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Error sending message" });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            product: productId,
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chat history" });
    }
};

export const getUserConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all unique conversations for the user
        // This is a simplified version
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .populate('sender', 'name')
            .populate('receiver', 'name')
            .populate('product', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching conversations" });
    }
};
