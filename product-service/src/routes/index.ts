import express from 'express';
import { productRouter } from './product';
import { reviewRouter } from './review';

export const router = express.Router();

const defaultRoutes = [
  {
    path: '/products',
    route: productRouter,
  },
  {
    path: '/products',
    route: reviewRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});