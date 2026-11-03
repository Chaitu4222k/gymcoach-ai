const { validationResult } = require("express-validator");
const {
  logBodyWeight,
  getBodyWeightLogs,
  deleteBodyWeightLog,
  getVolumeTrends,
  getMuscleGroupDistribution,
} = require("../services/progressService");

/**
 * Log a new body weight measurement.
 */
const logBodyWeightController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const entry = await logBodyWeight(req.body, req.user.id);
    res.status(201).json({
      message: "Body weight logged successfully",
      entry,
    });
  } catch (error) {
    console.error("Error logging body weight:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get body weight history and trajectory stats.
 */
const getBodyWeightLogsController = async (req, res) => {
  try {
    const data = await getBodyWeightLogs(req.user.id);
    res.json(data);
  } catch (error) {
    console.error("Error fetching weight logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete a body weight log.
 */
const deleteBodyWeightLogController = async (req, res) => {
  try {
    const result = await deleteBodyWeightLog(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting body weight log:", error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 * Get weekly volume progression trends over time.
 */
const getVolumeTrendsController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const trends = await getVolumeTrends(req.user.id, req.query.timeframe);
    res.json(trends);
  } catch (error) {
    console.error("Error fetching volume trends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get muscle group volume distribution over the past 30 days.
 */
const getMuscleDistributionController = async (req, res) => {
  try {
    const data = await getMuscleGroupDistribution(req.user.id);
    res.json(data);
  } catch (error) {
    console.error("Error fetching muscle group distribution:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  logBodyWeightController,
  getBodyWeightLogsController,
  deleteBodyWeightLogController,
  getVolumeTrendsController,
  getMuscleDistributionController,
};
