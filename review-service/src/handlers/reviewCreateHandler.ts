import amqp from "amqplib";
import { productReviewAverageService } from '../services';

export const reviewCreatedHandler = async (message: amqp.ConsumeMessage | null): Promise<void> => {
  if (!message) {
    return;
  }

  const reviewCreatedContent = JSON.parse(message.content.toString());
  await productReviewAverageService.calculateAverageReviewCreatedInput(({
    ...reviewCreatedContent,
    reviewId: reviewCreatedContent.id,
  }));
}