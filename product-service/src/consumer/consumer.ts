import amqp from "amqplib";
import { productReviewAverageUpdatedHandler } from '../handlers';

export const consumerConnect = async () => {
  const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  const channel = await connection.createChannel();
  console.log('Connected to RabbitMQ');

  const queuesHandlers = new Map<string, (message: amqp.ConsumeMessage | null) => Promise<void>>([
    [process.env.PRODUCT_REVIEW_AVERAGE_UPDATED_QUEUE_NAME || 'product-service-product-review-average-updated', productReviewAverageUpdatedHandler]
  ]);

  for (const [queueName, handler] of queuesHandlers) {
    await channel.assertQueue(queueName, { durable: false });
    await channel.consume(
      queueName,
      handler,
      { noAck: true }
    );
    console.log(`Waiting for messages in ${queueName}`);
  }
};