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
  updatePreferences,
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

router.put(
  "/preferences",
  authMiddleware,
  updatePreferences
);

module.exports = router;
