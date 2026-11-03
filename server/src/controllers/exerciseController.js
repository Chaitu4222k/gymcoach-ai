const { validationResult } = require("express-validator");
const {
  getExercises,
  getExerciseById,
  createCustomExercise,
  deleteCustomExercise,
} = require("../services/exerciseService");
const {
  MUSCLE_GROUPS,
  EXERCISE_CATEGORIES,
  DIFFICULTY_LEVELS,
  EXERCISE_EQUIPMENT,
} = require("../constants/exerciseConstants");

/**
 * Get all available exercises (standard library + user's custom exercises).
 */
const getExercisesController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user ? req.user.id : null;
    const exercises = await getExercises(req.query, userId);
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get exercise metadata / option values for filters and form dropdowns.
 */
const getExerciseOptionsController = (req, res) => {
  res.json({
    muscleGroups: MUSCLE_GROUPS,
    categories: EXERCISE_CATEGORIES,
    difficultyLevels: DIFFICULTY_LEVELS,
    equipment: EXERCISE_EQUIPMENT,
  });
};

/**
 * Get a single exercise by ID.
 */
const getExerciseByIdController = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const exercise = await getExerciseById(req.params.id, userId);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    console.error("Error fetching exercise by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Create a custom exercise for the authenticated user.
 */
const createCustomExerciseController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const exercise = await createCustomExercise(req.body, req.user.id);
    res.status(201).json({
      message: "Custom exercise created successfully",
      exercise,
    });
  } catch (error) {
    console.error("Error creating custom exercise:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete a user's custom exercise.
 */
const deleteCustomExerciseController = async (req, res) => {
  try {
    const result = await deleteCustomExercise(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting custom exercise:", error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  getExercisesController,
  getExerciseOptionsController,
  getExerciseByIdController,
  createCustomExerciseController,
  deleteCustomExerciseController,
};
