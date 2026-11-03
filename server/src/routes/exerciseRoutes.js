const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  validateCreateExercise,
  validateExerciseQuery,
} = require("../validators/exerciseValidator");
const {
  getExercisesController,
  getExerciseOptionsController,
  getExerciseByIdController,
  createCustomExerciseController,
  deleteCustomExerciseController,
} = require("../controllers/exerciseController");

// Exercise metadata options (muscle groups, categories, equipment, difficulties)
router.get("/options", authMiddleware, getExerciseOptionsController);

// Exercise listing with search and filters
router.get("/", authMiddleware, validateExerciseQuery, getExercisesController);

// Single exercise detail
router.get("/:id", authMiddleware, getExerciseByIdController);

// Create custom exercise
router.post(
  "/",
  authMiddleware,
  validateCreateExercise,
  createCustomExerciseController
);

// Delete custom exercise
router.delete("/:id", authMiddleware, deleteCustomExerciseController);

module.exports = router;
