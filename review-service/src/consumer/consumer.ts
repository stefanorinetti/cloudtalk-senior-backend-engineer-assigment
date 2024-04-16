import amqp from "amqplib";
import { reviewCreatedHandler, reviewDeletedHandler, reviewUpdatedHandler } from '../handlers';

export const consumerConnect = async () => {
  const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  const channel = await connection.createChannel();
  console.log('Connected to RabbitMQ');

  const queuesHandlers = new Map<string, (message: amqp.ConsumeMessage | null) => Promise<void>>([
    [process.env.REVIEW_CREATE_QUEUE_NAME || 'review-service-review-created', reviewCreatedHandler],
    [process.env.REVIEW_DELETED_QUEUE_NAME || 'review-service-review-deleted', reviewDeletedHandler],
    [process.env.REVIEW_UPDATED_QUEUE_NAME || 'review-service-review-updated', reviewUpdatedHandler]
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