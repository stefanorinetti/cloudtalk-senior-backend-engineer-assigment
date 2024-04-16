import amqp from "amqplib";
import { productReviewAverageService } from '../services';

export const reviewUpdatedHandler = async (message: amqp.ConsumeMessage | null): Promise<void> => {
  if (!message) {
    return;
  }
  const reviewUpdatedContent = JSON.parse(message.content.toString());
  await productReviewAverageService.calculateAverageReviewUpdated(({
    ...reviewUpdatedContent,
    reviewId: reviewUpdatedContent.id,
  }));
}