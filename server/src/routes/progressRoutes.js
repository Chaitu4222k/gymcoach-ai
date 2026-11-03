const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  validateLogBodyWeight,
  validateWeightIdParam,
  validateTimeframeQuery,
} = require("../validators/progressValidator");
const {
  logBodyWeightController,
  getBodyWeightLogsController,
  deleteBodyWeightLogController,
  getVolumeTrendsController,
  getMuscleDistributionController,
} = require("../controllers/progressController");

// Body weight tracking
router.post("/weight", authMiddleware, validateLogBodyWeight, logBodyWeightController);
router.get("/weight", authMiddleware, getBodyWeightLogsController);
router.delete("/weight/:id", authMiddleware, validateWeightIdParam, deleteBodyWeightLogController);

// Volume progression & muscle distribution
router.get("/volume", authMiddleware, validateTimeframeQuery, getVolumeTrendsController);
router.get("/muscles", authMiddleware, getMuscleDistributionController);

module.exports = router;
