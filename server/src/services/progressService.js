const BodyWeightLog = require("../models/BodyWeightLog");
const Profile = require("../models/Profile");
const WorkoutLog = require("../models/WorkoutLog");

/**
 * Log a body weight measurement and synchronize with user profile.
 */
const logBodyWeight = async (data, userId) => {
  const weight = Number(data.weight);
  const log = await BodyWeightLog.create({
    userId,
    weight,
    date: data.date ? new Date(data.date) : new Date(),
    notes: data.notes || "",
  });

  // Update current weight in user profile
  await Profile.findOneAndUpdate(
    { userId },
    { weight },
    { new: true, runValidators: true }
  );

  return log;
};

/**
 * Get body weight history and key trajectory statistics.
 */
const getBodyWeightLogs = async (userId) => {
  const logs = await BodyWeightLog.find({ userId }).sort({ date: 1 });

  if (logs.length === 0) {
    const profile = await Profile.findOne({ userId });
    return {
      logs: [],
      currentWeight: profile?.weight || null,
      startingWeight: profile?.weight || null,
      netChange: 0,
      lowestWeight: profile?.weight || null,
      highestWeight: profile?.weight || null,
    };
  }

  const startingWeight = logs[0].weight;
  const currentWeight = logs[logs.length - 1].weight;
  const netChange = Math.round((currentWeight - startingWeight) * 10) / 10;

  const weights = logs.map((l) => l.weight);
  const lowestWeight = Math.min(...weights);
  const highestWeight = Math.max(...weights);

  return {
    logs,
    currentWeight,
    startingWeight,
    netChange,
    lowestWeight,
    highestWeight,
  };
};

/**
 * Delete a body weight log.
 */
const deleteBodyWeightLog = async (id, userId) => {
  const log = await BodyWeightLog.findById(id);
  if (!log) {
    const error = new Error("Body weight log not found");
    error.statusCode = 404;
    throw error;
  }

  if (log.userId.toString() !== userId.toString()) {
    const error = new Error("Unauthorized to delete this weight log");
    error.statusCode = 403;
    throw error;
  }

  await BodyWeightLog.findByIdAndDelete(id);
  return { message: "Body weight log deleted successfully" };
};

/**
 * Get weekly volume progression trends over time.
 */
const getVolumeTrends = async (userId, timeframe = "4weeks") => {
  let weeksCount = 4;
  if (timeframe === "8weeks") weeksCount = 8;
  if (timeframe === "12weeks") weeksCount = 12;

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - weeksCount * 7);
  startDate.setHours(0, 0, 0, 0);

  const logs = await WorkoutLog.find({
    userId,
    date: { $gte: startDate },
  }).sort({ date: 1 });

  // Group by week
  const weeklyData = [];
  for (let w = 0; w < weeksCount; w++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekLogs = logs.filter((l) => l.date >= weekStart && l.date < weekEnd);
    const totalVolume = weekLogs.reduce(
      (sum, l) => sum + (l.totalVolumeKg || 0),
      0
    );

    const label = `Wk ${w + 1} (${weekStart.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    })})`;

    weeklyData.push({
      weekNumber: w + 1,
      label,
      startDate: weekStart,
      volumeKg: Math.round(totalVolume),
      workoutCount: weekLogs.length,
    });
  }

  return {
    timeframe,
    weeks: weeklyData,
    totalVolumeTonnage:
      weeklyData.reduce((acc, wk) => acc + wk.volumeKg, 0),
  };
};

/**
 * Compute muscle group training volume distribution over the past 30 days.
 */
const getMuscleGroupDistribution = async (userId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const logs = await WorkoutLog.find({
    userId,
    date: { $gte: thirtyDaysAgo },
  });

  const muscleCounts = {};
  let totalSets = 0;

  for (const log of logs) {
    if (Array.isArray(log.exercises)) {
      for (const ex of log.exercises) {
        const muscle = ex.primaryMuscle || "Full Body";
        const setNum = Array.isArray(ex.sets) ? ex.sets.length : 1;
        muscleCounts[muscle] = (muscleCounts[muscle] || 0) + setNum;
        totalSets += setNum;
      }
    }
  }

  const distribution = Object.entries(muscleCounts).map(([muscle, count]) => ({
    muscle,
    setCount: count,
    percentage: totalSets > 0 ? Math.round((count / totalSets) * 100) : 0,
  }));

  distribution.sort((a, b) => b.setCount - a.setCount);

  return {
    totalSetsTracked: totalSets,
    distribution,
  };
};

module.exports = {
  logBodyWeight,
  getBodyWeightLogs,
  deleteBodyWeightLog,
  getVolumeTrends,
  getMuscleGroupDistribution,
};
