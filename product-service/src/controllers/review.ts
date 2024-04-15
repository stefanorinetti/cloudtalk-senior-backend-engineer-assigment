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

export default {
  createReview,
  deleteReview,
}