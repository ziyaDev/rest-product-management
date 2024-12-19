# Nestjs-rest-api
## Introduction

This is a simple rest api for product management. It is built using nestjs and typescript. All APIs are fully validated using Zod schemas for both request inputs and response outputs, ensuring type safety and data validation throughout the entire application flow.

## Techstack

- [Nestjs](https://nestjs.com/) framework
- [Typescript](https://www.typescriptlang.org/) language
- [Mongodb](https://www.mongodb.com/) database
- [Mongoose](https://mongoosejs.com/) ORM
- [Render](https://render.com/) Deployment
- [Docker](https://www.docker.com/) Containerization
- [Zod](https://www.npmjs.com/package/zod) Validation
- [Biome](https://biomejs.dev/) Linting and formatting


## Local development

To develop the service locally you need:

- Node 18+
- MongoDB up and running

Once you have all the dependencies in place, you can launch:

# Installation

```bash
$ pnpm install
```
This command will install the dependencies. Now you can create your local copy of the `env` variables needed for launching the application.

```shell
cp ./.env.example ./.env.development.local # You can change `env` file or path on ConfigModule on AppModule
```
# Running the app
Once you have all your dependency in place, you can launch:
```shell
pnpm start:dev
```
and you will have the service exposed on your machine on the port `3000` or the one you have set on `PORT` variable.

Also, you can run the app in deferent mode using:
```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
- You can also run the app using docker
```bash
$ docker-compose up
```
## Usage
The Apis are exposed with `/api` prefix and all requests and responses are validated using Zod schemas. For example, to get all the products, you need to send a `GET` request to the `/api/products` endpoint.

### Registering a user
To register a user, you need to send a `POST` request to the `/auth/register` endpoint with the following body:
```json
{
  "firstName": "user1",
  "userName": "myUniqueUsername",
  "lastName": "user1",
  "password": "password"
}
```
### Authenticating a user
To authenticate a user, you need to send a `POST` request to the `/auth/login` endpoint with the following body:
```json
{
  "userName": "myUniqueUsername",
  "password": "password"
}
```
### Updating a user **Admin only**
To update a user, you need to send a `PUT` request to the `/auth/users/:userName` endpoint with the following body:
```json
{
    "firstName": "user1",
    "lastName": "user1",
    "password": "password"
}
```
### Getting all the products- **Authenticated only**
To get all the products, you need to send a `GET` request to the `/products` endpoint.

### Getting only your products **Admin only**
To get a all your products, you need to send a `GET` request to the `/products/:userName` endpoint.
### Creating a product **Authenticated only**
To create a product, you need to send a `POST` request to the `/products` endpoint with the following body:
```json
{
  "title": "product1",
  "price": 100,
  "description": "product1 description",
  "quantity": 10,
  "category": "Electronics",
  "options": [{"option":"Size", "values":["XL"]},{"option":"Color", "values":["Blue"]}]
}
```
### Updating a product **Admin only**
To update a product, you need to send a `PUT` request to the `/products/:productId` endpoint with the following body:
```json
{
  "title": "product1",
  "price": 100,
  "description": "product1 description",
  "quantity": 10,
  "category": "Electronics",
  "options": [{"option":"Size", "values":["XL"]},{"option":"Color", "values":["Blue"]}]
}
```
### Deleting a product **Admin only**
To delete a product, you need to send a `DELETE` request to the `/products/:productId` endpoint.
### Create a purchase **Authenticated only**
To create a purchase, you need to send a `POST` request to the `/purchases` endpoint with the following body:
```json
{
  "productId": "5f8d9f0a0b0e0c0d0e0f",
  "quantity": 10,
  "selectedOptions": [{"option":"Size", "value":"XL"},{"option":"Color", "value":"Blue"}]
}
```
Note that `selectedOptions` field the `option` and `value` fields should be defined on the product options.

### Getting all the purchases **Admin only**
To get all the purchases that belongs to the admin products, you need to send a `GET` request to the `/purchases` endpoint.

### Getting all the purchases stats **Admin only**
To get all the purchases stats, you need to send a `GET` request to the `/purchases/stats` endpoint.

### Getting Filtered credit cards
To get it, you need to send a `GET` request to the `/credit-cards` endpoint.
(This endpoint fetches all the credit cards from the random api using axios)

### Filtering and paginations

You can filter and paginate the results using a dynamic query.
- Paginations :
 - `limit`: The number of items to return per page. Default is `10`.
 - `page`: The page number to return. Default is `0`.
 You get in return this object along with data:
 ```json
 "data": ...,
 "pagination": {
         "totalCount": 3, // total count of data after filtering
         "pageSize": 1, // page size of limit you've set
         "totalPages": 3, // how many pages there base on your pagination
         "hasNextPage": true // Has next page ?
     }
 ```
 - Filtering:
 For filtering, you can create a dynamic query using the object fields with operators and values. For example, if you want to find products where the title contains "macbook" and the category is exactly "Electronics", with a limit of 1 item per page, you can use the following query:
 ```url
 example.com/api/products?title[$regex]=macbook&category=Electronics&limit=1&page
 ```

 For numeric fields like price, you can use comparison operators:
 ```url
 example.com/api/products?price[$gt]=100&price[$lt]=1000
 ```

 For exact string matches:
 ```url
 example.com/api/products?category=Electronics
 ```

 Note: You can use any MongoDB query operators ($gt, $lt, $gte, $lte, $regex, etc.) based on the field type - string operators for string fields and numeric operators for number fields.
 and you can still use the $or and $and operators.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
