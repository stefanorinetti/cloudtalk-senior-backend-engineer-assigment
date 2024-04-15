import { Document, model, Schema } from 'mongoose';
import { Review } from '../services';

interface ReviewDocument extends Document, Omit<Review, 'id'> {
  _id: string;
}
const ReviewSchema = new Schema<ReviewDocument>({
    productId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
});

const ReviewModel = model<ReviewDocument>('Review', ReviewSchema);

type SaveReviewInput = {
  firstName: Review['firstName'];
  lastName: Review['lastName'];
  text: Review['text'];
  rating: Review['rating'];
}

type DeleteReviewsInput = {
  productId: Review['productId'];
}

type DeleteReviewInput = {
  id: Review['id'];
}

const saveReview = async (reviewData: SaveReviewInput): Promise<Review> => {
  const review = new ReviewModel(reviewData);
  const savedReview = await review.save();
  const savedReviewToJSON = savedReview.toJSON();
  return {
    id: savedReviewToJSON._id.toString(),
    productId: savedReviewToJSON.productId,
    firstName: savedReviewToJSON.firstName,
    lastName: savedReviewToJSON.lastName,
    text: savedReviewToJSON.text,
    rating: savedReviewToJSON.rating,
  }
};

const deleteReviews = async (reviewData: DeleteReviewsInput): Promise<void> => {
  await ReviewModel.deleteMany({ productId: reviewData.productId });
};

const deleteReview = async ({ id }: DeleteReviewInput): Promise<Review | null> => {
  const deletedReview = await ReviewModel.findByIdAndDelete({ _id: id });
  if (!deletedReview) {
    return null;
  }
  const deletedReviewToJSON = deletedReview.toJSON();
  return {
    id: deletedReviewToJSON._id.toString(),
    productId: deletedReviewToJSON.productId,
    firstName: deletedReviewToJSON.firstName,
    lastName: deletedReviewToJSON.lastName,
    text: deletedReviewToJSON.text,
    rating: deletedReviewToJSON.rating,
  };
};

export default {
  deleteReview,
  deleteReviews,
  saveReview,
};