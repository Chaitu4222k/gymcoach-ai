const { getDashboardData } = require("../services/dashboardService");

/**
 * Get aggregated dashboard overview for authenticated user.
 */
const getDashboardController = async (req, res) => {
  try {
    const data = await getDashboardData(req.user.id);
    res.json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getDashboardController,
};
