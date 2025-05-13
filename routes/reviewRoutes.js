const express = require('express');
const router = express.Router();
const { createReview, getCarReviews } = require('../controllers/reviewController');

router.post('/', createReview);
router.get('/:carId', getCarReviews);


export default router;
