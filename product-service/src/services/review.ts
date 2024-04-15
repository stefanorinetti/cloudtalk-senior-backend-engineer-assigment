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

const createReview = async (createReviewInput: CreateReviewInput): Promise<Review> => {
  const associatedProduct = await productRepository.fetchProduct({ id: createReviewInput.productId });
  if (!associatedProduct) {
    throw new Error('Product not found');
  }
  const savedReview = await reviewRepository.saveReview(createReviewInput);
  await reviewPublisher.publishReviewCreatedMessage(savedReview);
  return savedReview;
};

export default {
  createReview,
}