const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  validateCreateRoutine,
  validateUpdateRoutine,
} = require("../validators/routineValidator");
const {
  getUserRoutinesController,
  getActiveRoutineController,
  getRoutineByIdController,
  createRoutineController,
  updateRoutineController,
  deleteRoutineController,
  setActiveRoutineController,
  getRoutineRecommendationsController,
} = require("../controllers/routineController");

// Rule-based starter routine recommendations
router.get("/recommendations", authMiddleware, getRoutineRecommendationsController);

// Get currently active routine
router.get("/active", authMiddleware, getActiveRoutineController);

// Routine CRUD
router.get("/", authMiddleware, getUserRoutinesController);
router.get("/:id", authMiddleware, getRoutineByIdController);
router.post("/", authMiddleware, validateCreateRoutine, createRoutineController);
router.put("/:id", authMiddleware, validateUpdateRoutine, updateRoutineController);
router.put("/:id/active", authMiddleware, setActiveRoutineController);
router.delete("/:id", authMiddleware, deleteRoutineController);

module.exports = router;
