import express from 'express';
import { createReview } from '../controllers/reviewController.js';
import protect from '../middeleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview); // المستخدم يجب أن يكون مسجلاً للدخول

export default router;
