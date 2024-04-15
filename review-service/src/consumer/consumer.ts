import amqp from "amqplib";

export const consumerConnect = async () => {
  const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  const channel = await connection.createChannel();
  console.log('Connected to RabbitMQ');

  const queuesHandlers = new Map<string, (message: amqp.ConsumeMessage) => Promise<void>>();

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