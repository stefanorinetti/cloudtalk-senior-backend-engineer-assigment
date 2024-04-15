import express from 'express';
import { reviewController } from '../controllers';

const reviewRouter = express.Router();

reviewRouter.post('/:productId/reviews', reviewController.createReview);

export { reviewRouter };