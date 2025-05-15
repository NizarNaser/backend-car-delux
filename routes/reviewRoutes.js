import express from 'express';
import { createReview, getCarReviews , removeComment} from '../controllers/reviewController.js';
import authMiddleware from '../middeleware/auth.js'; // تأكد من المسار الصحيح

const router = express.Router();

// حماية المسار باستخدام الـ middleware للتحقق من التوكن
router.post('/list-comment', authMiddleware, createReview);
router.get('/:carId', getCarReviews);
router.post('/remove/:carId', removeComment);

export default router;
