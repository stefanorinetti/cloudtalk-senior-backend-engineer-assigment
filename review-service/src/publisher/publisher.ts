import amqp from "amqplib";
import { ProductReviewAverage } from '../services';

let connection: amqp.Connection;
let channel: amqp.Channel;
const exchange = process.env.PRODUCT_REVIEW_AVERAGE_EXCHANGE_NAME ||'product-review-average-exchange';

export const publisherConnect = async () => {
  connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'topic');
  console.log('Connected to RabbitMQ');
}

export const publishProductReviewAverageUpdated = async (productReviewAverage: ProductReviewAverage) => {
  channel.publish(exchange, 'productReviewAverage.updated', Buffer.from(JSON.stringify(productReviewAverage)))
  console.log(" [x] Sent '%s'", productReviewAverage);
}