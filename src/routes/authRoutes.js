import express from 'express';
import { register, login, updateProfileImage, updateProfile, socialLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);
router.put('/profile-image', protect, upload.single('image'), updateProfileImage);
router.put('/profile', protect, updateProfile);
router.post('/social-login', socialLogin);

export default router;
