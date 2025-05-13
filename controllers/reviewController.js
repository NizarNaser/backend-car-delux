import Review from '../models/Review.js';

export const createReview = async (req, res) => {
    try {
      const { carId, rating, comment } = req.body;
  
      const review = new Review({
        carId,
        user: req.user.name,  // 👍 الاسم من التوكن
        rating,
        comment
      });
      
  
      await review.save();
      res.status(201).json(review);
    } catch (err) {
      res.status(500).json({ message: 'Error adding review', error: err });
    }
  };
  
  

export const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ carId: req.params.carId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err });
  }
};
