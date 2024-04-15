import amqp from "amqplib";
import { productService } from '../services';

export const productReviewAverageUpdatedHandler = async (message: amqp.ConsumeMessage | null): Promise<void> => {
  if (!message) {
    return;
  }

  const productReviewAverageContent = JSON.parse(message.content.toString());
  productService.patchProduct({
    ...productReviewAverageContent,
    id: productReviewAverageContent.productId,
  });
}