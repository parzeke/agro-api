import User from '../config/models/user.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsersWithLocation = async (req, res) => {
    try {
        const users = await User.find({
            location: { $ne: null },
            'location.coordinates': { $exists: true, $ne: [] }
        }).select('name avatar location address');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Note: Registration and Login are handled in authController.js
// This controller is for user management/lookup.
