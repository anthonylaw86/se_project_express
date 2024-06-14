const router = require("express").Router();
const { authorization } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");
const {
  validateClothingItem,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(authorization);

router.post("/", validateClothingItem, createItem);

router.delete("/:itemId", validateItemId, deleteItem);

router.put("/:itemId/likes", validateItemId, likeClothingItem);

router.delete("/:itemId/likes", validateItemId, unlikeClothingItem);

module.exports = router;
