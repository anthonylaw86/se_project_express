const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const { authorization } = require("../middlewares/auth");
const { NOT_FOUND_ERROR } = require("../utils/errors");

const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", authorization, userRouter);

router.use("/items", authorization, clothingItemRouter);

router.post("/signin", login);

router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
