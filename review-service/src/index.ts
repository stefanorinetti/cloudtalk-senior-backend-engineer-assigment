import mongoose from 'mongoose';
import { consumerConnect } from './consumer';
import { publisherConnect } from './publisher';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/productReviewAverages');
  await publisherConnect();
  await consumerConnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});