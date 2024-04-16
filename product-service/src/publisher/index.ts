import { publisherConnect, publishReviewCreatedMessage, publishReviewDeletedMessage, publishReviewUpdatedMessage } from './publisher';

const reviewPublisher = {
  publishReviewCreatedMessage,
  publishReviewDeletedMessage,
  publishReviewUpdatedMessage
}

export {
  publisherConnect,
  reviewPublisher
}