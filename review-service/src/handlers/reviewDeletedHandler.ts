import amqp from "amqplib";
import { productReviewAverageService } from '../services';

export const reviewDeletedHandler = async (message: amqp.ConsumeMessage | null): Promise<void> => {
  if (!message) {
    return;
  }
  const reviewDeletedContent = JSON.parse(message.content.toString());
  await productReviewAverageService.calculateAverageReviewDeleted(({
    ...reviewDeletedContent,
    reviewId: reviewDeletedContent.id,
  }));
}