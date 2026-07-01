const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  validateCreateProfile,
  validateUpdateProfile,
} = require("../validators/profileValidator");

const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

router.post(
  "/",
  authMiddleware,
  validateCreateProfile,
  createProfile
);

router.get(
  "/",
  authMiddleware,
  getProfile
);

router.put(
  "/",
  authMiddleware,
  validateUpdateProfile,
  updateProfile
);

router.delete(
  "/",
  authMiddleware,
  deleteProfile
);

module.exports = router;