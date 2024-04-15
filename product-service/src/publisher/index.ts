import { publisherConnect, publishReviewCreatedMessage, publishReviewDeletedMessage } from './publisher';

const reviewPublisher = {
  publishReviewCreatedMessage,
  publishReviewDeletedMessage
}

export {
  publisherConnect,
  reviewPublisher
}