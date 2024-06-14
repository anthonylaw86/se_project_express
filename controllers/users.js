const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {BadRequestError} = require('../utils/Errors/badRequestError')
const {NotFoundError} = require('../utils/Errors/notFoundError')
const {ConflictError} = require('../utils/Errors/conflictError')
const {UnauthorizedError} = require('../utils/Errors/unauthorizedError')


// CREATE USER

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    next(new BadRequestError("Email is required"));
  }

  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      next(new ConflictError("User already exists"));
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
      .then(() => res.status(201).send({ name, avatar, email }))
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          next(new ConflictError("Email already exists"));
        }
        if (err.name === "ValidationError") {
          next(new BadRequestError("Invalid data"));
        }
        next(err);
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
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

// LOGIN

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
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
      }
      next(err);
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
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUserInfo,
};
