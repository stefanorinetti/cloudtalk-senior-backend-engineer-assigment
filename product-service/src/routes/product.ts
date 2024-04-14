import express from 'express';
import { productController } from '../controllers';

const productRouter = express.Router();

productRouter.post('/', productController.createProduct);

export { productRouter };