import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { reviewService } from '../services';

const createReview = async (req: Request, res: Response) => {
  const createdReview = await reviewService.createReview({
    ...req.body,
    productId: req.params.productId
  });
  res.status(httpStatus.CREATED).send(createdReview);
};

const deleteReview = async (req: Request, res: Response) => {
  const deletedReview = await reviewService.deleteReview({ id: req.params.id });
  res.status(httpStatus.OK).send(deletedReview);
};

const patchReview = async (req: Request, res: Response) => {
  const patchedReview = await reviewService.patchReview({ ...req.body, id: req.params.id });
  res.status(httpStatus.OK).send(patchedReview);
};

const fetchReview = async (req: Request, res: Response) => {
  const fetchedReview = await reviewService.fetchReview({ id: req.params.id });
  res.status(httpStatus.OK).send(fetchedReview);
};

export default {
  createReview,
  fetchReview,
  deleteReview,
  patchReview,
}