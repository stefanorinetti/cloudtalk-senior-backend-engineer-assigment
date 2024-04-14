import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { productService } from '../services';

const createProduct = async (req: Request, res: Response) => {
  const createdProduct = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(createdProduct);
};

export default {
  createProduct,
}