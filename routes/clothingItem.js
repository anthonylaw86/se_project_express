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

router.post("/", authorization, createItem);

router.delete("/:itemId", authorization, deleteItem);

router.put("/:itemId/likes", authorization, likeClothingItem);

router.delete("/:itemId/likes", authorization, unlikeClothingItem);

module.exports = router;
