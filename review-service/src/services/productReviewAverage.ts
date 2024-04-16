import { productReviewAveragePublisher } from '../publisher';
import { productReviewAverageRepository } from '../repositories';

export type ProductReviewAverage = {
  id: string;
  reviewId: string;
  productId: string;
  averageRating: number;
  numberOfReviews: number;
}

type ProductReviewAverageToBeSaved = Omit<ProductReviewAverage, 'id'> & { id?: ProductReviewAverage['id'] };

type CalculateAverageReviewCreatedInput = {
  reviewId: ProductReviewAverage['reviewId'];
  productId: ProductReviewAverage['productId'];
  rating: number;
}

type CalculateAverageReviewDeletedInput = {
  reviewId: ProductReviewAverage['productId'];
  productId: ProductReviewAverage['productId'];
  rating: number;
}

type CalculateAverageReviewUpdatedInput = {
  reviewId: ProductReviewAverage['productId'];
  productId: ProductReviewAverage['productId'];
  rating: number;
  previousRating: number;
}

const calculateAverageReviewCreatedInput = async (createReviewInput: CalculateAverageReviewCreatedInput): Promise<void> => {
  let productReviewAverageToBeSaved: ProductReviewAverageToBeSaved;
  const productReviewAverage = await productReviewAverageRepository.fetchProductReviewAverage({ productId: createReviewInput.productId });
  if (!productReviewAverage) {
    productReviewAverageToBeSaved = {
      reviewId: createReviewInput.reviewId,
      productId: createReviewInput.productId,
      averageRating: createReviewInput.rating,
      numberOfReviews: 1,
    }
  } else {
    productReviewAverageToBeSaved = {
      id: productReviewAverage.id,
      reviewId: createReviewInput.reviewId,
      productId: productReviewAverage.productId,
      averageRating: (productReviewAverage.averageRating * productReviewAverage.numberOfReviews + createReviewInput.rating) / (productReviewAverage.numberOfReviews + 1),
      numberOfReviews: productReviewAverage.numberOfReviews + 1,
    }
  }
  const savedProductReviewAverage = await productReviewAverageRepository.saveProductReviewAverage(productReviewAverageToBeSaved);
  await productReviewAveragePublisher.publishProductReviewAverageUpdated(savedProductReviewAverage);
};

const calculateAverageReviewDeleted = async (deleteReviewInput: CalculateAverageReviewDeletedInput): Promise<void> => {
  const productReviewAverage = await productReviewAverageRepository.fetchProductReviewAverage({ productId: deleteReviewInput.productId });
  if (!productReviewAverage) {
    return;
  }

  if (productReviewAverage.numberOfReviews - 1 === 0) {
    const deletedProductReviewAverage = await productReviewAverageRepository.deleteProductReviewAverage({ id: productReviewAverage.id });
    if (!deletedProductReviewAverage) {
      return;
    }
    // Could have used a deleted event to lower coupling between review and product with the `-1`
    // Deleting this entity would have meant setting the average rating to `undefined` in product-service
    await productReviewAveragePublisher.publishProductReviewAverageUpdated({
      ...deletedProductReviewAverage,
      averageRating: -1,
    });
    return;
  }  

  const productReviewAverageToBeSaved: ProductReviewAverageToBeSaved = {
    id: productReviewAverage.id,
    reviewId: productReviewAverage.reviewId,
    productId: productReviewAverage.productId,
    averageRating: (productReviewAverage.averageRating * productReviewAverage.numberOfReviews - deleteReviewInput.rating) / (productReviewAverage.numberOfReviews - 1),
    numberOfReviews: productReviewAverage.numberOfReviews - 1,
  }
  
  const savedProductReviewAverage = await productReviewAverageRepository.saveProductReviewAverage(productReviewAverageToBeSaved);
  await productReviewAveragePublisher.publishProductReviewAverageUpdated(savedProductReviewAverage);
};

const calculateAverageReviewUpdated = async (updateReviewInput: CalculateAverageReviewUpdatedInput): Promise<void> => {
  const productReviewAverage = await productReviewAverageRepository.fetchProductReviewAverage({ productId: updateReviewInput.productId });
  if (!productReviewAverage) {
    return;
  }

  const productReviewAverageToBeSaved: ProductReviewAverageToBeSaved = {
    id: productReviewAverage.id,
    reviewId: productReviewAverage.reviewId,
    productId: productReviewAverage.productId,
    averageRating: (productReviewAverage.averageRating * productReviewAverage.numberOfReviews - updateReviewInput.previousRating + updateReviewInput.rating) / (productReviewAverage.numberOfReviews),
    numberOfReviews: productReviewAverage.numberOfReviews,
  }
  
  const savedProductReviewAverage = await productReviewAverageRepository.saveProductReviewAverage(productReviewAverageToBeSaved);
  await productReviewAveragePublisher.publishProductReviewAverageUpdated(savedProductReviewAverage);
};

export default {
  calculateAverageReviewDeleted,
  calculateAverageReviewUpdated,
  calculateAverageReviewCreatedInput,
}