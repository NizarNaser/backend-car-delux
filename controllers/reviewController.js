const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { carId, user, rating, comment } = req.body;
    const review = new Review({ carId, user, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review', error: err });
  }
};

exports.getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ carId: req.params.carId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err });
  }
};
