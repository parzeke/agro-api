import Review from '../config/models/Review.js';
import User from '../config/models/user.js';

export const createReview = async (req, res) => {
    try {
        const { reviewee, rating, comment } = req.body;
        const reviewer = req.user.id;

        if (!reviewee || !rating) {
            return res.status(400).json({ message: 'Reviewee and rating are required' });
        }

        if (reviewer === reviewee) {
            return res.status(400).json({ message: 'You cannot review yourself' });
        }

        const review = await Review.create({
            reviewer,
            reviewee,
            rating,
            comment,
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ reviewee: userId })
            .populate('reviewer', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
