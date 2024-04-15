import { productReviewAveragePublisher } from '../publisher';
import { productReviewAverageRepository } from '../repositories';

export type ProductReviewAverage = {
  id: string;
  productId: string;
  averageRating: number;
  numberOfReviews: number;
}

type ProductReviewAverageToBeSaved = Omit<ProductReviewAverage, 'id'> & { id?: ProductReviewAverage['id'] };

type CalculateAverageReviewCreatedInput = {
  productId: ProductReviewAverage['productId'];
  rating: number;
}

const calculateAverageReviewCreatedInput = async (createReviewInput: CalculateAverageReviewCreatedInput): Promise<void> => {
  let productReviewAverageToBeSaved: ProductReviewAverageToBeSaved;
  const productReviewAverage = await productReviewAverageRepository.fetchProductReviewAverage({ productId: createReviewInput.productId });
  if (!productReviewAverage) {
    productReviewAverageToBeSaved = {
      productId: createReviewInput.productId,
      averageRating: createReviewInput.rating,
      numberOfReviews: 1,
    }
  } else {
    productReviewAverageToBeSaved = {
      id: productReviewAverage.id,
      productId: productReviewAverage.productId,
      averageRating: (productReviewAverage.averageRating * productReviewAverage.numberOfReviews + createReviewInput.rating) / (productReviewAverage.numberOfReviews + 1),
      numberOfReviews: productReviewAverage.numberOfReviews + 1,
    }
  }
  const savedProductReviewAverage = await productReviewAverageRepository.saveProductReviewAverage(productReviewAverageToBeSaved);
  await productReviewAveragePublisher.publishProductReviewAverageUpdated(savedProductReviewAverage);
};

export default {
  calculateAverageReviewCreatedInput,
}