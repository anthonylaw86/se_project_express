require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// request logger
app.use(requestLogger);

// our routes
app.use(cors());
app.use(express.json());
app.use("/", indexRouter);

// error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
