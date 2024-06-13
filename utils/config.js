const { JWT_SECRET = "secret-pass-phrase" } = process.env;

const crypto = require("crypto"); // importing the crypto module

const randomString = crypto
  .randomBytes(16) // generating a random sequence of 16 bytes (128 bits)
  .toString("hex"); // converting it into a string

console.log(randomString);

module.exports = { JWT_SECRET };
