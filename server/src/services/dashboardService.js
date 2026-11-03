const Profile = require("../models/Profile");
const WorkoutRoutine = require("../models/WorkoutRoutine");
const WorkoutLog = require("../models/WorkoutLog");

/**
 * Aggregates complete dashboard data for the authenticated user.
 */
const getDashboardData = async (userId) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [profile, activeRoutine, recentLogs, totalWorkouts, thisWeekLogs] =
    await Promise.all([
      Profile.findOne({ userId }),
      WorkoutRoutine.findOne({ userId, isActive: true }),
      WorkoutLog.find({ userId }).sort({ date: -1 }).limit(3),
      WorkoutLog.countDocuments({ userId }),
      WorkoutLog.find({ userId, date: { $gte: startOfWeek } }),
    ]);

  // Compute weekly volume and completed sessions
  const workoutsThisWeek = thisWeekLogs.length;
  const weeklyVolumeKg = thisWeekLogs.reduce(
    (acc, log) => acc + (log.totalVolumeKg || 0),
    0
  );

  const targetDaysPerWeek = profile?.workoutDaysPerWeek || activeRoutine?.daysPerWeek || 3;
  const weeklyProgressPercent = Math.min(
    100,
    Math.round((workoutsThisWeek / targetDaysPerWeek) * 100)
  );

  // Determine suggested workout day from active routine
  let suggestedDay = null;
  if (activeRoutine?.days && activeRoutine.days.length > 0) {
    // Determine day index using day of week (0 = Sun, 1 = Mon ... 6 = Sat)
    const dayOfWeek = now.getDay(); // 0-6
    const splitIndex = dayOfWeek % activeRoutine.days.length;
    suggestedDay = activeRoutine.days[splitIndex] || activeRoutine.days[0];
  }

  return {
    userSummary: {
      fitnessGoal: profile?.fitnessGoal || "Build Muscle",
      weight: profile?.weight || null,
      height: profile?.height || null,
      targetDaysPerWeek,
    },
    weeklyStats: {
      workoutsCompleted: workoutsThisWeek,
      targetWorkouts: targetDaysPerWeek,
      progressPercent: weeklyProgressPercent,
      volumeKg: Math.round(weeklyVolumeKg * 10) / 10,
      totalWorkoutsAllTime: totalWorkouts,
    },
    activeRoutine: activeRoutine
      ? {
          _id: activeRoutine._id,
          name: activeRoutine.name,
          goal: activeRoutine.goal,
          difficulty: activeRoutine.difficulty,
          daysPerWeek: activeRoutine.daysPerWeek,
          suggestedDay: suggestedDay
            ? {
                dayNumber: suggestedDay.dayNumber,
                name: suggestedDay.name,
                isRestDay: suggestedDay.isRestDay,
                exerciseCount: suggestedDay.exercises?.length || 0,
                exercises: suggestedDay.exercises || [],
              }
            : null,
        }
      : null,
    recentWorkouts: recentLogs.map((log) => ({
      _id: log._id,
      routineName: log.routineName,
      dayName: log.dayName,
      date: log.date,
      durationMinutes: log.durationMinutes,
      totalVolumeKg: log.totalVolumeKg,
      feeling: log.feeling,
      exerciseCount: log.exercises?.length || 0,
    })),
  };
};

module.exports = {
  getDashboardData,
};
