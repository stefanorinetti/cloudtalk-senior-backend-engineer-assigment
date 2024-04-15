import amqp from "amqplib";
import { productReviewAverageService } from '../services';

export const reviewCreatedHandler = async (message: amqp.ConsumeMessage | null): Promise<void> => {
  if (!message) {
    return;
  }

  productReviewAverageService.calculateAverageReviewCreatedInput(JSON.parse(message.content.toString()));
}