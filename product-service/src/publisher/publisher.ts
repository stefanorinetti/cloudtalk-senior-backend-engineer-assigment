import amqp from "amqplib";

let connection: amqp.Connection;
let channel: amqp.Channel;
const exchange = process.env.REVIEW_EXCHANGE_NAME ||'review-exchange';

export const publisherConnect = async () => {
  connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'topic');
  console.log('Connected to RabbitMQ');
}