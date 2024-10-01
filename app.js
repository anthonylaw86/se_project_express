require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const helmet = require("helmet");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const limiter = require("./middlewares/rateLimiter");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// Rate Limiter
app.use(limiter);

// Set security headers
app.use(helmet());

// Basic request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});

// CORS and Body Parsing Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use(requestLogger);

// Routes
app.use("/", indexRouter);

// Error Logger
app.use(errorLogger);

// Celebrate Error Handler
app.use(errors());

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
