const WorkoutLog = require("../models/WorkoutLog");

/**
 * Calculates total volume in kilograms for a workout session.
 */
const calculateTotalVolume = (exercises = []) => {
  let total = 0;
  for (const ex of exercises) {
    if (Array.isArray(ex.sets)) {
      for (const set of ex.sets) {
        if (set.completed !== false) {
          const reps = Number(set.reps) || 0;
          const weight = Number(set.weight) || 0;
          total += reps * weight;
        }
      }
    }
  }
  return Math.round(total * 100) / 100;
};

/**
 * Log a completed workout session.
 */
const logWorkoutSession = async (sessionData, userId) => {
  const totalVolumeKg = calculateTotalVolume(sessionData.exercises);

  return await WorkoutLog.create({
    ...sessionData,
    userId,
    totalVolumeKg,
  });
};

/**
 * Get paginated workout history for user.
 */
const getWorkoutLogs = async (userId, { limit = 20, page = 1 } = {}) => {
  const numericLimit = Math.max(1, Math.min(100, Number(limit) || 20));
  const numericPage = Math.max(1, Number(page) || 1);
  const skip = (numericPage - 1) * numericLimit;

  const [logs, total] = await Promise.all([
    WorkoutLog.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(numericLimit),
    WorkoutLog.countDocuments({ userId }),
  ]);

  return {
    logs,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit) || 1,
  };
};

/**
 * Get single workout log by ID.
 */
const getWorkoutLogById = async (id, userId) => {
  const log = await WorkoutLog.findById(id);
  if (!log) {
    const error = new Error("Workout log not found");
    error.statusCode = 404;
    throw error;
  }

  if (log.userId.toString() !== userId.toString()) {
    const error = new Error("Unauthorized to access this workout log");
    error.statusCode = 403;
    throw error;
  }

  return log;
};

/**
 * Delete a workout log.
 */
const deleteWorkoutLog = async (id, userId) => {
  await getWorkoutLogById(id, userId);
  await WorkoutLog.findByIdAndDelete(id);
  return { message: "Workout session deleted successfully" };
};

/**
 * Compute aggregate statistics for user's workout history.
 */
const getWorkoutHistoryStats = async (userId) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [totalWorkouts, recentLog, aggregation] = await Promise.all([
    WorkoutLog.countDocuments({ userId }),
    WorkoutLog.findOne({ userId }).sort({ date: -1 }),
    WorkoutLog.aggregate([
      { $match: { userId: new (require("mongoose").Types.ObjectId)(userId) } },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: "$totalVolumeKg" },
          totalDuration: { $sum: "$durationMinutes" },
        },
      },
    ]),
  ]);

  const workoutsThisWeek = await WorkoutLog.countDocuments({
    userId,
    date: { $gte: startOfWeek },
  });

  return {
    totalWorkouts,
    workoutsThisWeek,
    totalVolumeKg: aggregation[0]?.totalVolume || 0,
    totalDurationMinutes: aggregation[0]?.totalDuration || 0,
    lastWorkoutDate: recentLog?.date || null,
  };
};

module.exports = {
  calculateTotalVolume,
  logWorkoutSession,
  getWorkoutLogs,
  getWorkoutLogById,
  deleteWorkoutLog,
  getWorkoutHistoryStats,
};
