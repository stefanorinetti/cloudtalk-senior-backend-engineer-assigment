## Starting the services

1. Install the necessary packages in the `/product-service` and `/review-service` directories by running `npm i`
2. Once the packages are installed, navigate to the root folder of the project and run `docker-compose up`

Note: Typically, I avoid committing `.env` files, but for convenience, they have been committed this time.

You can navigate to a handy MongoDB UI at `http://0.0.0.0:8081/`. You can also have the rabbitmq-management UI at `http://localhost:15672/` (username: user, password: pass).

## Trade-offs

### API

I set up the API with a hierarchical architecture. For instance, instead of using `GET localhost:4000/reviews/${reviewId}`, I used `GET localhost:4000/products/${productId}/reviews/${reviewId}` to fetch a review. In this project, the `${productId}` part isn't necessary, but I chose this style because it's easier for clients to understand.

#### Average Rating Handling

There are at least three options to handle the average rating for a product stored in the `review-service`:

- **Requesting Average Rating on Demand**: The `product-service` could ask for the average rating from the `review-service` every time it's needed. However, this adds latency and could bring down the endpoint if the `review-service` is down. We could mitigate this with circuit breakers or caches.
  
- **Replicating Average Rating**: I decided to replicate the average rating in the `product-service`. It might not be accurate if new reviews are added, but it's okay for users to see a slightly outdated average for a short time.
  
- **Using GraphQL Federation**: Another option is to use GraphQL federation with a gateway. In this setup, the `product-service` is responsible for the `Product` entity, while the `review-service` provides the `averageRating` field of the `Product` entity. Network calls for fetching a `Product` and its `averageRating` happen in parallel. If the `review-service` is down, `averageRating` returns `null`, which handles partial failure gracefully.

### Database Choice: MongoDB

I opted for MongoDB as the database solution due to its ease of setup, simple query language, and the absence of the need for database migrations. MongoDB's flexibility and document-oriented nature make it well-suited for handling large amounts of data, such as product reviews.

#### Schema Design: Separate Collections for Products and Reviews

To accommodate a potentially large volume of reviews, I decided to use two separate collections for products and reviews instead of embedding reviews within product documents. This decision was made to avoid reaching the maximum document size limit of 16MB and to ensure efficient querying and management of reviews.

#### Considerations with NoSQL Databases

While MongoDB offers advantages in terms of flexibility and scalability, it also comes with certain trade-offs compared to traditional SQL databases:

- **Loss of SQL Features**: NoSQL databases like MongoDB lack certain features found in SQL databases, such as foreign key support and ACID transactions. We also could not use `SELECT ... FOR UPDATE` to modify the review average by taking a lock, preventing race conditions. Optimistic locking in MongoDB serves the same purpose.
  
- **Handling Relationships**: In the case of MongoDB, managing relationships between entities like products and reviews requires additional considerations, as demonstrated in the [product service code](https://github.com/stefanorinetti/cloudtalk-senior-backend-engineer-assigment/blob/326791db4119c8c185306bfb208ec50aefeaaa1b/product-service/src/services/product.ts#L60). In a SQL database, this task could be achieved more straightforwardly using foreign keys with cascade/delete policies, ensuring atomicity and data integrity.

### Message Broker Choice: RabbitMQ

RabbitMQ was selected because it's the broker I am most familiar with and I wanted to save on time regarding this aspect of the architecture.
Services directly publish to exchanges and listen to queues.

#### Topology

In the configuration, there are two exchanges serving distinct purposes. The `review-exchange` manages various review events, including creation, deletion, and updates.

Each event is directed to its dedicated queue, enhancing since every RabbitMQ queue runs on a different process. This approach also improves fault tolerance; with separate queues, the review system remains operational even if a poison message occurs in a queue.

For updating the `averageRating` value in the `product-service`, the `product-review-average-exchange` exchange was created. This exchange handles events related to review averages. Right now, only the updated event is utilized. Incorporating the deleted event could offer additional functionality, such as setting the `averageRating` to `null` in the `product-service`, without creating tight coupling between the systems.

## What's missing?

Some key things you'd find in a fully polished system were omitted to get the project completed quicker. Here's what's missing:

- **API validation**: Right now, our APIs accept whatever you throw at them without checking.
- **No top-level error handling**: If something goes wrong, the process stops and it needs to be executed manually again.
- **Errors exposed to clients**: Clients can see what's happening behind the scenes, which isn't ideal. We should wrap internal errors in a `500` response.
- **No optimistic locking**: When updating the review average, we're not protecting against multiple updates for the same product happening at once. This could mess up our averages if things get chaotic.
- **Missing `PRODUCT_DELETED` event**: If we had this, the `review-service` could tidy up when a product gets deleted.

## Handy curl commands

This is a collection of curl commands. There is one for each existing endpoint.

#### Create a product

```curl -X POST -H "Content-Type: application/json" -d '{"name": "Sample Product", "description": "This is a sample product.", "price": 99.99}' http://localhost:4000/products```

#### Fetch a product

```curl -X GET http://localhost:4000/products/${productId}```

#### Fetch every product

```curl -X GET http://localhost:4000/products```

#### Delete a product

```curl -X DELETE http://localhost:4000/products/${productId}```

#### Patch a product

```curl -X PATCH -H "Content-Type: application/json" -d '{"price": 88.88}' http://localhost:4000/products/${productId}```

#### Create a review

```curl -X POST -H "Content-Type: application/json" -d '{"firstName": "Stefano", "lastName": "Rinetti", "rating": 5, "text": "Great product!"}' http://localhost:4000/products/${productId}/reviews```

#### Fetch a review

```curl -X GET http://localhost:4000/products/${productId}/reviews/${reviewId}```

#### Fetch every review for a product

```curl -X GET http://localhost:4000/products/${productId}/reviews```

#### Delete a review

```curl -X DELETE http://localhost:4000/products/${productId}/reviews/${reviewId}```

#### Patch a review

```curl -X PATCH -H "Content-Type: application/json" -d '{"rating": 5"}' http://localhost:4000/products/${productId}/reviews/${reviewId}```

