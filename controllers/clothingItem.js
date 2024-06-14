const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

// CREATE CLOTHING ITEM

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

// GET CLOTHING ITEM

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

// DELETE CLOTHING ITEM

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findById({ _id: itemId })
    .orFail()
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
      }

      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("This item doesn't belong to you"));
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      next(err);
    });
};

// LIKE CLOTHING ITEM
const likeClothingItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      }
      next(err);
    });
};

// UNLIKE CLOTHING ITEM

const unlikeClothingItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
};
