import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  limit: 100,
  statusCode: 429,
  message: "The max number of API requests have been reached",
});

export default limiter;
