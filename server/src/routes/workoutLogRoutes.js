const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  validateCreateWorkoutLog,
  validateLogIdParam,
  validateWorkoutQuery,
} = require("../validators/workoutLogValidator");
const {
  createWorkoutLogController,
  getWorkoutLogsController,
  getWorkoutHistoryController,
  getWorkoutLogByIdController,
  deleteWorkoutLogController,
} = require("../controllers/workoutLogController");

// Workout history with stats
router.get("/history", authMiddleware, validateWorkoutQuery, getWorkoutHistoryController);

// Session list & retrieval
router.get("/", authMiddleware, validateWorkoutQuery, getWorkoutLogsController);
router.get("/:id", authMiddleware, validateLogIdParam, getWorkoutLogByIdController);

// Log session
router.post("/", authMiddleware, validateCreateWorkoutLog, createWorkoutLogController);

// Delete session
router.delete("/:id", authMiddleware, validateLogIdParam, deleteWorkoutLogController);

module.exports = router;
