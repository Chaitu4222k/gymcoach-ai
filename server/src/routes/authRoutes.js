const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
  changePassword,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
  validateChangePassword,
} = require("../validators/authValidator");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/password", authMiddleware, validateChangePassword, changePassword);

module.exports = router;
