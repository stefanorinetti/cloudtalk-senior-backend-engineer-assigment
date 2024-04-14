import { productRepository } from '../repositories';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
}

type CreateProductInput = {
  name: Product["name"];
  description: Product["description"];
  price: Product["price"];
}

const createProduct = async (createProductInput: CreateProductInput): Promise<Product> => {
  const savedProduct = await productRepository.saveProduct(createProductInput);
  return savedProduct;
};

export default {
  createProduct,
}