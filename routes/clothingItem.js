const router = require("express").Router();
const { authorization } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

router.get("/", getItems);

router.use(authorization);

router.post("/", createItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeClothingItem);

router.delete("/:itemId/likes", unlikeClothingItem);

module.exports = router;
