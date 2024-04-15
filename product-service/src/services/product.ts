import { productRepository } from '../repositories';

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

export default {
  createProduct,
  fetchProducts,
  patchProduct,
}