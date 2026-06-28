const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  login
);

module.exports = router;