import express from 'express';
import { productController } from '../controllers';

const productRouter = express.Router();

productRouter
  .get('/:id', productController.fetchProduct)
  .get('/', productController.fetchProducts)
  .delete('/:id', productController.deleteProduct)
  .post('/', productController.createProduct)
  .patch('/:id', productController.patchProduct);

export { productRouter };