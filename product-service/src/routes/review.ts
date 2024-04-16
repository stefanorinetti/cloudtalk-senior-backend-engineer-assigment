import express from 'express';
import { reviewController } from '../controllers';

const reviewRouter = express.Router();

reviewRouter
  .get('/:productId/reviews/:id', reviewController.fetchReview)
  .post('/:productId/reviews', reviewController.createReview)
  .delete('/:productId/reviews/:id', reviewController.deleteReview)
  .patch('/:productId/reviews/:id', reviewController.patchReview);

export { reviewRouter };