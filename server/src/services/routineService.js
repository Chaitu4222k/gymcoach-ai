const WorkoutRoutine = require("../models/WorkoutRoutine");
const Profile = require("../models/Profile");
const Exercise = require("../models/Exercise");

/**
 * Get all workout routines created by the user.
 */
const getUserRoutines = async (userId) => {
  return await WorkoutRoutine.find({ userId }).sort({
    isActive: -1,
    updatedAt: -1,
  });
};

/**
 * Get the currently active workout routine for the user.
 */
const getActiveRoutine = async (userId) => {
  return await WorkoutRoutine.findOne({ userId, isActive: true });
};

/**
 * Get a specific routine by ID, ensuring user ownership.
 */
const getRoutineById = async (id, userId) => {
  const routine = await WorkoutRoutine.findById(id);
  if (!routine) {
    const error = new Error("Workout routine not found");
    error.statusCode = 404;
    throw error;
  }

  if (routine.userId.toString() !== userId.toString()) {
    const error = new Error("Unauthorized to access this routine");
    error.statusCode = 403;
    throw error;
  }

  return routine;
};

/**
 * Create a new workout routine for the user.
 */
const createRoutine = async (routineData, userId) => {
  const isActive = routineData.isActive ?? true;

  if (isActive) {
    await WorkoutRoutine.updateMany({ userId }, { isActive: false });
  }

  return await WorkoutRoutine.create({
    ...routineData,
    userId,
    isActive,
  });
};

/**
 * Update an existing workout routine.
 */
const updateRoutine = async (id, routineData, userId) => {
  await getRoutineById(id, userId);

  if (routineData.isActive === true) {
    await WorkoutRoutine.updateMany(
      { userId, _id: { $ne: id } },
      { isActive: false }
    );
  }

  return await WorkoutRoutine.findByIdAndUpdate(id, routineData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete a workout routine.
 */
const deleteRoutine = async (id, userId) => {
  await getRoutineById(id, userId);
  await WorkoutRoutine.findByIdAndDelete(id);
  return { message: "Workout routine deleted successfully" };
};

/**
 * Set a specific routine as active and deactivate all other routines.
 */
const setActiveRoutine = async (id, userId) => {
  await getRoutineById(id, userId);

  await WorkoutRoutine.updateMany({ userId }, { isActive: false });

  return await WorkoutRoutine.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  );
};

/**
 * Generate a deterministic, rule-based starter routine based on user profile.
 */
const generateStarterRoutineRecommendation = async (userId) => {
  const profile = await Profile.findOne({ userId });

  const daysPerWeek = profile?.workoutDaysPerWeek || 3;
  const goal = profile?.fitnessGoal || "Build Muscle";
  const experienceMonths = profile?.experienceMonths || 0;
  const difficulty =
    experienceMonths > 24
      ? "Advanced"
      : experienceMonths > 6
      ? "Intermediate"
      : "Beginner";

  // Build template based on daysPerWeek
  let templateDays = [];

  if (daysPerWeek <= 3) {
    templateDays = [
      {
        dayNumber: 1,
        name: "Day 1: Full Body Foundation",
        targetMuscleGroups: ["Chest", "Back", "Quadriceps", "Core / Abs"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Barbell Squat",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 10,
            restSeconds: 120,
            notes: "Focus on controlled depth and bracing.",
          },
          {
            exerciseName: "Barbell Bench Press",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 90,
            notes: "Keep shoulders retracted against the bench.",
          },
          {
            exerciseName: "Bent-Over Barbell Row",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 90,
            notes: "Maintain flat neutral spine.",
          },
          {
            exerciseName: "Plank",
            targetSets: 3,
            targetRepsMin: 30,
            targetRepsMax: 60,
            restSeconds: 60,
            notes: "Hold rigid posture.",
          },
        ],
      },
      {
        dayNumber: 2,
        name: "Day 2: Active Recovery / Rest",
        targetMuscleGroups: [],
        isRestDay: true,
        exercises: [],
      },
      {
        dayNumber: 3,
        name: "Day 3: Full Body Strength & Hypertrophy",
        targetMuscleGroups: ["Hamstrings", "Shoulders", "Biceps", "Triceps"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Romanian Deadlift",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 10,
            restSeconds: 120,
            notes: "Hinge at hips, slight knee bend.",
          },
          {
            exerciseName: "Overhead Barbell Press",
            targetSets: 3,
            targetRepsMin: 6,
            targetRepsMax: 10,
            restSeconds: 90,
            notes: "Tight glutes and core throughout press.",
          },
          {
            exerciseName: "Pull-ups",
            targetSets: 3,
            targetRepsMin: 6,
            targetRepsMax: 10,
            restSeconds: 90,
            notes: "Full range of motion, avoid swinging.",
          },
          {
            exerciseName: "Dumbbell Bicep Curls",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 15,
            restSeconds: 60,
            notes: "Controlled squeeze at peak contraction.",
          },
        ],
      },
    ];
  } else if (daysPerWeek === 4) {
    templateDays = [
      {
        dayNumber: 1,
        name: "Day 1: Upper Body Power",
        targetMuscleGroups: ["Chest", "Back", "Shoulders"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Barbell Bench Press",
            targetSets: 4,
            targetRepsMin: 6,
            targetRepsMax: 8,
            restSeconds: 120,
          },
          {
            exerciseName: "Barbell Bent-Over Row",
            targetSets: 4,
            targetRepsMin: 6,
            targetRepsMax: 8,
            restSeconds: 120,
          },
          {
            exerciseName: "Overhead Barbell Press",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 10,
            restSeconds: 90,
          },
        ],
      },
      {
        dayNumber: 2,
        name: "Day 2: Lower Body Power",
        targetMuscleGroups: ["Quadriceps", "Hamstrings", "Calves"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Barbell Squat",
            targetSets: 4,
            targetRepsMin: 6,
            targetRepsMax: 8,
            restSeconds: 120,
          },
          {
            exerciseName: "Romanian Deadlift",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 10,
            restSeconds: 90,
          },
          {
            exerciseName: "Standing Calf Raises",
            targetSets: 3,
            targetRepsMin: 12,
            targetRepsMax: 15,
            restSeconds: 60,
          },
        ],
      },
      {
        dayNumber: 3,
        name: "Day 3: Upper Body Hypertrophy",
        targetMuscleGroups: ["Chest", "Back", "Biceps", "Triceps"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Incline Dumbbell Press",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            restSeconds: 75,
          },
          {
            exerciseName: "Lat Pulldowns",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            restSeconds: 75,
          },
          {
            exerciseName: "Tricep Rope Pushdowns",
            targetSets: 3,
            targetRepsMin: 12,
            targetRepsMax: 15,
            restSeconds: 60,
          },
        ],
      },
      {
        dayNumber: 4,
        name: "Day 4: Lower Body & Core Hypertrophy",
        targetMuscleGroups: ["Quadriceps", "Glutes", "Core / Abs"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Leg Press",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            restSeconds: 90,
          },
          {
            exerciseName: "Walking Dumbbell Lunges",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            restSeconds: 75,
          },
          {
            exerciseName: "Hanging Leg Raises",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 15,
            restSeconds: 60,
          },
        ],
      },
    ];
  } else {
    // 5-6 Days: Push / Pull / Legs Split
    templateDays = [
      {
        dayNumber: 1,
        name: "Day 1: Push (Chest / Shoulders / Triceps)",
        targetMuscleGroups: ["Chest", "Shoulders", "Triceps"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Barbell Bench Press",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 10,
            restSeconds: 90,
          },
          {
            exerciseName: "Overhead Barbell Press",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 10,
            restSeconds: 90,
          },
          {
            exerciseName: "Incline Dumbbell Press",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            restSeconds: 60,
          },
          {
            exerciseName: "Dips",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 60,
          },
        ],
      },
      {
        dayNumber: 2,
        name: "Day 2: Pull (Back / Biceps / Rear Delts)",
        targetMuscleGroups: ["Back", "Biceps"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Conventional Deadlift",
            targetSets: 3,
            targetRepsMin: 5,
            targetRepsMax: 8,
            restSeconds: 120,
          },
          {
            exerciseName: "Pull-ups",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 90,
          },
          {
            exerciseName: "Barbell Bent-Over Row",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 90,
          },
          {
            exerciseName: "Barbell Bicep Curl",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            restSeconds: 60,
          },
        ],
      },
      {
        dayNumber: 3,
        name: "Day 3: Legs & Core",
        targetMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Core / Abs"],
        isRestDay: false,
        exercises: [
          {
            exerciseName: "Barbell Squat",
            targetSets: 4,
            targetRepsMin: 6,
            targetRepsMax: 10,
            restSeconds: 120,
          },
          {
            exerciseName: "Romanian Deadlift",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 90,
          },
          {
            exerciseName: "Leg Press",
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            restSeconds: 75,
          },
          {
            exerciseName: "Hanging Leg Raises",
            targetSets: 3,
            targetRepsMin: 12,
            targetRepsMax: 15,
            restSeconds: 60,
          },
        ],
      },
    ];
  }

  return {
    name: `${goal} — ${daysPerWeek}-Day Foundation Split`,
    description: `Tailored starter program crafted for your ${goal.toLowerCase()} goal and ${daysPerWeek}-day training cadence.`,
    goal,
    difficulty,
    daysPerWeek,
    days: templateDays,
    isActive: true,
  };
};

module.exports = {
  getUserRoutines,
  getActiveRoutine,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  setActiveRoutine,
  generateStarterRoutineRecommendation,
};
