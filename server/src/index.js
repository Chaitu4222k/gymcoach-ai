const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "GymCoach API",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GymCoach API running on port ${PORT}`);
});