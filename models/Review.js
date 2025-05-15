import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({ 
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  user: { type: String, default: "Anonymous" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
