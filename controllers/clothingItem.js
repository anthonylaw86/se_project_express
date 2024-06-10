const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

// CREATE CLOTHING ITEM

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  // const userId = req.body._id;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
        // res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      } else {
        next(err);
        // res
        //   .status(INTERNAL_SERVER_ERROR)
        //   .send({ message: "An error has occurred on the server." });
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
      // res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
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
        // return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }

      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("This item doesn't belong to you"));
        // return res
        //   .status(FORBIDDEN_ERROR)
        //   .send({ message: "This item doesn't belong to you" });
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError('Item not found'));
        // return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
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
        next(new NotFoundError('Item not found'));
        // return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        next(new BadRequestError('Invalid item ID'));
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
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
        next(new NotFoundError('Item not found'))
        // return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        next(new BadRequestError('Invalid data'))
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      next(err)
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
};
