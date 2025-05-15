import express from 'express';
import { createReview, getCarReviews , removeComment, listComment} from '../controllers/reviewController.js';
import authMiddleware from '../middeleware/auth.js'; // تأكد من المسار الصحيح

const router = express.Router();

router.get('/list-comment', listComment);          // ← اجعله أولاً
router.post('/', authMiddleware, createReview);
router.get('/:carId', getCarReviews);              // ← بعده
router.post('/remove/:carId', removeComment);

export default router;
