import { Document, model, Schema } from 'mongoose';
import { ProductReviewAverage } from '../services';

interface ProductReviewAverageDocument extends Document, Omit<ProductReviewAverage, 'id'> {
  _id: string;
}
const ProductReviewAverageSchema = new Schema<ProductReviewAverageDocument>({
    productId: { type: String, required: true },
    reviewId: { type: String, required: true },
    averageRating: { type: Number, required: true },
    numberOfReviews: { type: Number, required: true },
});

const ProductReviewAverageModel = model<ProductReviewAverageDocument>('ProductReviewAverage', ProductReviewAverageSchema);

type FetchProductReviewAverageInput = {
  productId: ProductReviewAverage['productId'];
}

type SaveProductReviewAverageInput = {
  id?: ProductReviewAverage['id'];
  reviewId: ProductReviewAverage['reviewId'];
  productId: ProductReviewAverage['productId'];
  averageRating: ProductReviewAverage['averageRating'];
  numberOfReviews: ProductReviewAverage['numberOfReviews'];
}

type DeleteProductReviewAverageInput = {
  id: ProductReviewAverage['id'];
}

const fetchProductReviewAverage = async ({ productId }: FetchProductReviewAverageInput): Promise<ProductReviewAverage | null> => {
  const savedProductReviewAverage = await ProductReviewAverageModel.findOne({ productId });
  if (!savedProductReviewAverage) {
    return null;
  }
  const savedProductReviewAverageToJSON = savedProductReviewAverage.toJSON();
  return {
    id: savedProductReviewAverageToJSON._id.toString(),
    reviewId: savedProductReviewAverageToJSON.reviewId,
    productId: savedProductReviewAverageToJSON.productId,
    averageRating: savedProductReviewAverageToJSON.averageRating,
    numberOfReviews: savedProductReviewAverageToJSON.numberOfReviews,
  }
};

const deleteProductReviewAverage = async ({ id }: DeleteProductReviewAverageInput): Promise<ProductReviewAverage | null> => {
  const deletedProductReviewAverage = await ProductReviewAverageModel.findOneAndDelete({ _id: id });
  if (!deletedProductReviewAverage) {
    return null;
  }
  const deletedProductReviewAverageToJSON = deletedProductReviewAverage.toJSON();
  return {
    id: deletedProductReviewAverageToJSON._id.toString(),
    reviewId: deletedProductReviewAverageToJSON.reviewId,
    productId: deletedProductReviewAverageToJSON.productId,
    averageRating: deletedProductReviewAverageToJSON.averageRating,
    numberOfReviews: deletedProductReviewAverageToJSON.numberOfReviews,
  }
};

const saveProductReviewAverage = async (productReviewAverageData: SaveProductReviewAverageInput): Promise<ProductReviewAverage> => {
  const productReviewAverage = new ProductReviewAverageModel({ ...productReviewAverageData, _id: productReviewAverageData.id });
  if (productReviewAverageData.id) {
    productReviewAverage.isNew = false;
  } else {
    productReviewAverage.isNew = true;
  }
  const savedproductReviewAverage = await productReviewAverage.save();
  const savedproductReviewAverageToJSON = savedproductReviewAverage.toJSON();
  return {
    id: savedproductReviewAverageToJSON._id.toString(),
    reviewId: savedproductReviewAverageToJSON.reviewId,
    productId: savedproductReviewAverageToJSON.productId,
    averageRating: savedproductReviewAverageToJSON.averageRating,
    numberOfReviews: savedproductReviewAverageToJSON.numberOfReviews,
  }
};

export default {
  deleteProductReviewAverage,
  fetchProductReviewAverage,
  saveProductReviewAverage,
};