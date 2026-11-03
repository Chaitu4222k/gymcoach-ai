const { validationResult } = require("express-validator");
const {
  logWorkoutSession,
  getWorkoutLogs,
  getWorkoutLogById,
  deleteWorkoutLog,
  getWorkoutHistoryStats,
} = require("../services/workoutLogService");

/**
 * Log a completed workout session.
 */
const createWorkoutLogController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const workout = await logWorkoutSession(req.body, req.user.id);
    res.status(201).json({
      message: "Workout logged successfully",
      workout,
    });
  } catch (error) {
    console.error("Error logging workout session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get user workout sessions list.
 */
const getWorkoutLogsController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const result = await getWorkoutLogs(req.user.id, req.query);
    res.json(result);
  } catch (error) {
    console.error("Error fetching workout logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get workout history along with overall performance statistics.
 */
const getWorkoutHistoryController = async (req, res) => {
  try {
    const [historyResult, stats] = await Promise.all([
      getWorkoutLogs(req.user.id, req.query),
      getWorkoutHistoryStats(req.user.id),
    ]);

    res.json({
      ...historyResult,
      stats,
    });
  } catch (error) {
    console.error("Error fetching workout history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get single workout session by ID.
 */
const getWorkoutLogByIdController = async (req, res) => {
  try {
    const workout = await getWorkoutLogById(req.params.id, req.user.id);
    res.json(workout);
  } catch (error) {
    console.error("Error fetching workout by ID:", error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 * Delete a workout session.
 */
const deleteWorkoutLogController = async (req, res) => {
  try {
    const result = await deleteWorkoutLog(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting workout log:", error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  createWorkoutLogController,
  getWorkoutLogsController,
  getWorkoutHistoryController,
  getWorkoutLogByIdController,
  deleteWorkoutLogController,
};
