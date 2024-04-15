import { productRepository, reviewRepository } from '../repositories';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  averageRating?: number;
}

type CreateProductInput = {
  name: Product["name"];
  description: Product["description"];
  price: Product["price"];
}

type FetchProductsInput = {}

type PatchProductInput = {
  id: Product["id"];
  name?: Product["name"];
  description?: Product["description"];
  price?: Product["price"];
  averageRating?: Product["averageRating"];
}

type DeleteProductInput = {
  id: Product["id"];
}

const createProduct = async (createProductInput: CreateProductInput): Promise<Product> => {
  const savedProduct = await productRepository.saveProduct(createProductInput);
  return savedProduct;
};

const fetchProducts = async (_?: FetchProductsInput): Promise<Product[]> => {
  const products = await productRepository.fetchProducts();
  return products;
};

const patchProduct = async (patchProductInput: PatchProductInput): Promise<Product> => {
  const patchedProduct = await productRepository.patchProduct(patchProductInput);
  if (!patchedProduct) {
    throw new Error('Product not found');
  }
  return patchedProduct;
};

const deleteProduct = async (deleteProductInput: DeleteProductInput): Promise<Product> => {
  const deletedProduct = await productRepository.deleteProduct(deleteProductInput);
  await reviewRepository.deleteReviews({ productId: deleteProductInput.id });
  if (!deletedProduct) {
    throw new Error('Product not found');
  }
  // publish PRODUCT_DELETED event to rabbitmq
  return deletedProduct;
};

export default {
  createProduct,
  deleteProduct,
  fetchProducts,
  patchProduct,
}