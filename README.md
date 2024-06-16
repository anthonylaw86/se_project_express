# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Functionality Key Features API Endpoints: Implement RESTful API endpoints to facilitate data retreival, creation, updating & deletion for the WTWR application. Database Integration: Integrate with a database to store and manage application data efficiently. User Authorization: Implement authentication and authorization mechanisms to ensure secure access to the applications resources. Security Measures: Implement encryption, input validation, and other security measures to protect against common web vulnerabilities.

### Technologies Used

Node.js: Used as the runtime environment for the server-side application.

Express: Employed as the web application framework to build a robust & scalable API's.

MongoDB: Chosed as the database to store and manage application data effectively.

JWT(JSON Web Tokens): Implemented for the user authentication and authorization.

### Security Measures

Helmet: Used to secure Express apps by setting vaious HTTP headers.

bcrypt: Employed for hashing and salting passwords to enhance security.

CORS: Implemented CORS middleware to handle cross-origin resource sharing.

### Testing

Jest: Utilized for writing unit tests and integration tests for the server-side code.

### Other Tools & Libraries

Mongoose: Used as an ODM (Object Data Modeling) library for MongoDB to simplify interactions with the database.

Dotenv: Used for the managing environment variables and configuration settings.

Joi & Celebrate: Used for an express middleware function that wraps the joi validation library.

Winston: Used for a simple and universal logging library with support for multiple transports.

ExpressWinston: Provides middleware for request and error logging of your express.js application.

### DOMAINS

https://wtwr.madhacker.biz

https://www.wtwr.madhacker.biz

https://api.wtwr.madhacker.biz
