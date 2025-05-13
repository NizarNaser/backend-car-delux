import express from 'express';
const router = express.Router();
import { createReview, getCarReviews } from '../controllers/reviewController.js';

router.post('/', createReview);
router.get('/:carId', getCarReviews);


export default router;
