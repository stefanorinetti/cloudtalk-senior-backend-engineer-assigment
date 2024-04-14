import express from 'express';
import { productRouter } from './product';

export const router = express.Router();

const defaultRoutes = [
  {
    path: '/products',
    route: productRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});