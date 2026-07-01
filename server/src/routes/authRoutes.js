const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/register",
  validateRegister,
  register
);

router.post(
  "/login",
  validateLogin,
  login
);

router.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

module.exports = router;