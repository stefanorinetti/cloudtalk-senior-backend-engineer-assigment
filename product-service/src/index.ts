import express from 'express';
import { router } from './routes';
import mongoose from 'mongoose';
import { publisherConnect } from './publisher';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/products');
  console.log('Connected to MongoDB');
  await publisherConnect();

  const app = express();
  const port = process.env.PORT || 3000;
  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(router);
  

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});