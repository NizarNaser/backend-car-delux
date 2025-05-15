import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    const review = new Review({
      carId,
      user: req.user.name || "Anonymous",  // تأكد من اسم المستخدم
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
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

//remove comment 
export const removeComment = async (req,res) => {
  try {
    const comment = await Review.findById(req.body.id);


    await Review.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"comment Removed"});

  } catch (error) {
    console.log(error);
        res.json({success:false,message:"Error"})
  }
}

//all comment list
export const listComment = async (req,res) => {
  try {
      const comments = await Review.find();

      res.json({success:true,data:comments});

  } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})

  }
}