import amqp from "amqplib";
import { Review } from '../services';

let connection: amqp.Connection;
let channel: amqp.Channel;
const exchange = process.env.REVIEW_EXCHANGE_NAME ||'review-exchange';

export const publisherConnect = async () => {
  connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'topic');
  console.log('Connected to RabbitMQ');
}

export const publishReviewCreatedMessage = async (review: Review) => {
  channel.publish(exchange, 'review.created', Buffer.from(JSON.stringify(review)))
  console.log(" [x] Sent '%s'", review);
}

export const publishReviewDeletedMessage = async (review: Review) => {
  channel.publish(exchange, 'review.deleted', Buffer.from(JSON.stringify(review)))
  console.log(" [x] Sent '%s'", review);
}

export const publishReviewUpdatedMessage = async (review: Review | { previousRating: number }) => {
  channel.publish(exchange, 'review.updated', Buffer.from(JSON.stringify(review)))
  console.log(" [x] Sent '%s'", review);
}