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

const deleteProduct = async (req: Request, res: Response) => {
  const deletedProduct = await productService.deleteProduct({ id: req.params.id });
  res.status(httpStatus.OK).send(deletedProduct);
};

export default {
  createProduct,
  deleteProduct,
  fetchProducts,
}