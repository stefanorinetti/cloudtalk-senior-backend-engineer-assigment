import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { productService } from '../services';

const createProduct = async (req: Request, res: Response) => {
  const createdProduct = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(createdProduct);
};

const fetchProducts = async (_: Request, res: Response) => {
  const fetchedProducts = await productService.fetchProducts();
  res.status(httpStatus.OK).send(fetchedProducts);
};

export default {
  createProduct,
  fetchProducts,
}