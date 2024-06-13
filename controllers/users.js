const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

// CREATE USER

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    next(new BadRequestError("Email is required"));
    // return res
    //   .status(BAD_REQUEST_ERROR)
    //   .send({ message: "Email is required." });
  }

  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      next(new ConflictError("User already exists"));
      // return res
      //   .status(CONFLICT_ERROR)
      //   .send({ message: "User already exists" });
    }
    return bcrypt
      .hash(password, 10)
      .then((hashedPassword) =>
        User.create({
          name,
          avatar,
          email,
          password: hashedPassword,
        })
      )
      .then(() => res.status(201).send({ name, avatar, email, password }))
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          next(new ConflictError("Email already exists"));
          // return res
          //   .status(CONFLICT_ERROR)
          //   .send({ message: "Email already exists" });
        }
        if (err.name === "ValidationError") {
          next(new BadRequestError("Invalid data"));
          // return res
          //   .status(BAD_REQUEST_ERROR)
          //   .send({ message: "Invalid data" });
        }
        next(err);
        // return res
        //   .status(INTERNAL_SERVER_ERROR)
        //   .send({ message: "An error has occurred on the server." });
      });
  });
};

// GET USER BY ID

const getCurrentUser = (req, res, next) => {
  // const userId = req.user._id;
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
        // return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
        // return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

// LOGIN

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
    // return res
    //   .status(BAD_REQUEST_ERROR)
    //   .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Unauthorized"));
        // return res.status(UNAUTHORIZED_ERROR).send({ message: "Unauthorized" });
      }
      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

// UPDATE USER

const updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
        // return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
        // return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid Data" });
      }
      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUserInfo,
};
