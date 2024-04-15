import express from 'express';
import { reviewController } from '../controllers';

const reviewRouter = express.Router();

reviewRouter
  .post('/:productId/reviews', reviewController.createReview)
  .delete('/:productId/reviews/:id', reviewController.deleteReview);

export { reviewRouter };