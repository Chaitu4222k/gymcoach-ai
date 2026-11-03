const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardController } = require("../controllers/dashboardController");

// Aggregated dashboard overview
router.get("/", authMiddleware, getDashboardController);

module.exports = router;
