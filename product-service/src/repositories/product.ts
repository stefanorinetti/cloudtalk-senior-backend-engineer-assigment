import { Document, model, Schema } from 'mongoose';
import { Product } from '../services';

interface ProductDocument extends Document, Omit<Product, 'id'> {
  _id: string;
}
const ProductSchema = new Schema<ProductDocument>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

const ProductModel = model<ProductDocument>('Product', ProductSchema);


type SaveProductInput = {
  name: Product['name'];
  description: Product['description'];
  price: Product['price'];
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
  }
};

export default {
  saveProduct,
};