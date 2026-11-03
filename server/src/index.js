const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const routineRoutes = require("./routes/routineRoutes");
const workoutLogRoutes = require("./routes/workoutLogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const progressRoutes = require("./routes/progressRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { seedStandardExercises } = require("./services/exerciseService");

dotenv.config();

connectDB().then(() => {
  seedStandardExercises();
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts/routines", routineRoutes);
app.use("/api/workouts", workoutLogRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);

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
