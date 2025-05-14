import express from 'express';
import { createReview, getCarReviews } from '../controllers/reviewController.js';
import authMiddleware from '../middeleware/auth.js'; // تأكد من المسار الصحيح

const router = express.Router();

// حماية المسار باستخدام الـ middleware للتحقق من التوكن
router.post('/', authMiddleware, createReview);
router.get('/:carId', getCarReviews);

export default router;
