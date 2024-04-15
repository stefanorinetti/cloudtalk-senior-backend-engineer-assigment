import express from 'express';
import { productController } from '../controllers';

const productRouter = express.Router();

productRouter
  .get('/', productController.fetchProducts)
  .delete('/:id', productController.deleteProduct)
  .post('/', productController.createProduct);

export { productRouter };