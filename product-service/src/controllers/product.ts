import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { productService } from '../services';

const createProduct = async (req: Request, res: Response) => {
  const createdProduct = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(createdProduct);
};

const fetchProduct = async (req: Request, res: Response) => {
  const fetchedProduct = await productService.fetchProduct({ id: req.params.id });
  res.status(httpStatus.OK).send(fetchedProduct);
};

const fetchProducts = async (_: Request, res: Response) => {
  const fetchedProducts = await productService.fetchProducts();
  res.status(httpStatus.OK).send(fetchedProducts);
};

const deleteProduct = async (req: Request, res: Response) => {
  const deletedProduct = await productService.deleteProduct({ id: req.params.id });
  res.status(httpStatus.OK).send(deletedProduct);
};

const patchProduct = async (req: Request, res: Response) => {
  const patchedProduct = await productService.patchProduct({ ...req.body, id: req.params.id });
  res.status(httpStatus.OK).send(patchedProduct);
};

export default {
  createProduct,
  deleteProduct,
  fetchProduct,
  fetchProducts,
  patchProduct,
}