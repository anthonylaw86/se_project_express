const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItem");

// CRUD

// CREATE
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", deleteItem);

// Like an Item
router.put("/items/:itemId/likes", likeClothingItem);

// Unlike an Item
router.delete("/items/:itemId/likes", unlikeClothingItem);

module.exports = router;