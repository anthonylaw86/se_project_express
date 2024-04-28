const router = require("express").Router();
const { INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } = require("../utils/errors");

const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND_ERROR).send({ message: err.message });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "Router not found" });
});

module.exports = router;
