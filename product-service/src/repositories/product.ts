import { Document, model, Schema } from 'mongoose';
import { Product } from '../services';

interface ProductDocument extends Document, Omit<Product, 'id'> {
  _id: string;
}
const ProductSchema = new Schema<ProductDocument>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    averageRating: { type: Number },
});

const ProductModel = model<ProductDocument>('Product', ProductSchema);

type SaveProductInput = {
  id?: Product['id'];
  name: Product['name'];
  description: Product['description'];
  price: Product['price'];
}

type PatchProductInput = {
  id: Product['id'];
  name?: Product['name'];
  description?: Product['description'];
  price?: Product['price'];
  averageRating?: Product['averageRating'];
}

type FetchProductInput = {
  id: Product['id'];
}

type DeleteProductInput = {
  id: Product['id'];
}

const saveProduct = async (productData: SaveProductInput): Promise<Product> => {
  const product = new ProductModel(productData);
  const savedProduct = await product.save();
  const savedProductToJSON = savedProduct.toJSON();
  return {
    id: savedProductToJSON._id.toString(),
    name: savedProductToJSON.name,
    description: savedProductToJSON.description,
    price: savedProductToJSON.price,
    averageRating: savedProductToJSON.averageRating

  }
};

const patchProduct = async (patchProductData: PatchProductInput): Promise<Product | null> => {
  const patchedProduct = await ProductModel.findOneAndUpdate(
    { _id: patchProductData.id },
    patchProductData,
    { new: true }
  );
  if (!patchedProduct) {
    return null;
  }
  const patchedProductToJSON = patchedProduct.toJSON();
  return {
    id: patchedProductToJSON._id.toString(),
    name: patchedProductToJSON.name,
    description: patchedProductToJSON.description,
    price: patchedProductToJSON.price,
    averageRating: patchedProductToJSON.averageRating,
  }
};

const fetchProduct = async ({ id }: FetchProductInput): Promise<Product | null> => {
  const product = await ProductModel.findById(id);
  if (!product) {
    return null;
  }
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    averageRating: product.averageRating
  };
};

const fetchProducts = async (): Promise<Product[]> => {
  const products = await ProductModel.find();
  return products.map(product => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    averageRating: product.averageRating
  }));
};

const deleteProduct = async ({ id }: DeleteProductInput): Promise<Product | null> => {
  const deletedProduct = await ProductModel.findByIdAndDelete({ _id: id });
  if (!deletedProduct) {
    return null;
  }
  const deletedProductToJSON = deletedProduct.toJSON();
  return {
    id: deletedProductToJSON._id.toString(),
    name: deletedProductToJSON.name,
    description: deletedProductToJSON.description,
    price: deletedProductToJSON.price,
    averageRating: deletedProductToJSON.averageRating
  };
};

export default {
  deleteProduct,
  fetchProduct,
  fetchProducts,
  patchProduct,
  saveProduct,
};