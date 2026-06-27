const express = require("express");

const app = express();

const PORT = 5000;

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "GymCoach API",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GymCoach API running on port ${PORT}`);
});