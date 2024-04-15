import express from 'express';
import { productController } from '../controllers';

const productRouter = express.Router();

productRouter
  .get('/', productController.fetchProducts)
  .post('/', productController.createProduct);

export { productRouter };