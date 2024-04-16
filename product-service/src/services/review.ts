import { reviewPublisher } from '../publisher';
import { productRepository, reviewRepository } from '../repositories';

export type Review = {
  id: string;
  productId: string;
  firstName: string;
  lastName: string;
  text: string;
  rating: number;
}

type CreateReviewInput = {
  productId: Review["productId"];
  firstName: Review["firstName"];
  lastName: Review["lastName"];
  text: Review["text"];
  rating: Review["rating"];
}

type DeleteReviewInput = {
  id: Review["id"];
}

type PatchReviewInput = {
  id: Review["id"];
  firstName: Review["firstName"];
  lastName: Review["lastName"];
  text: Review["text"];
  rating: Review["rating"];
}

type FetchReviewInput = {
  id: Review["id"];
}

const createReview = async (createReviewInput: CreateReviewInput): Promise<Review> => {
  const associatedProduct = await productRepository.fetchProduct({ id: createReviewInput.productId });
  if (!associatedProduct) {
    throw new Error('Product not found');
  }
  const savedReview = await reviewRepository.saveReview(createReviewInput);
  await reviewPublisher.publishReviewCreatedMessage(savedReview);
  return savedReview;
};

const deleteReview = async (deleteReviewInput: DeleteReviewInput): Promise<Review> => {
  const deletedReview = await reviewRepository.deleteReview(deleteReviewInput);
  if (!deletedReview) {
    throw new Error('Review not found');
  }
  await reviewPublisher.publishReviewDeletedMessage(deletedReview);
  return deletedReview;
};

const patchReview = async (patchReviewInput: PatchReviewInput): Promise<Review> => {
  const review = await reviewRepository.fetchReview(patchReviewInput);
  if (!review) {
    throw new Error('Review not found');
  }
  const patchedReview = await reviewRepository.patchReview(patchReviewInput);
  if (!patchedReview) {
    throw new Error('Review not found');
  }
  await reviewPublisher.publishReviewUpdatedMessage({ ...patchedReview, previousRating: review.rating });
  return patchedReview;
};

const fetchReview = async (fetchReviewInput: FetchReviewInput): Promise<Review> => {
  const review = await reviewRepository.fetchReview({ id: fetchReviewInput.id });
  if (!review) {
    throw new Error('Review not found');
  }
  return review;
};

export default {
  createReview,
  deleteReview,
  fetchReview,
  patchReview,
}