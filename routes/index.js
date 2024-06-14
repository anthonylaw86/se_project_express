const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const { authorization } = require("../middlewares/auth");
const {
  validateUserLogin,
  validateUserInfo,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/Errors/notFoundError");

const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", authorization, userRouter);

router.use("/items", clothingItemRouter);

router.post("/signin", validateUserLogin, login);

router.post("/signup", validateUserInfo, createUser);

router.use((req, res, next) => next(new NotFoundError("Router not found")));

module.exports = router;
