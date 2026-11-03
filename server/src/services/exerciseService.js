const Exercise = require("../models/Exercise");
const standardExercises = require("../data/standardExercises");

/**
 * Seeds standard exercise library into database if not already present.
 */
const seedStandardExercises = async () => {
  try {
    const existingCount = await Exercise.countDocuments({ isCustom: false });
    if (existingCount === 0) {
      const docs = standardExercises.map((ex) => ({
        ...ex,
        isCustom: false,
        userId: null,
      }));
      await Exercise.insertMany(docs);
      console.log(`✅ Seeded ${docs.length} standard exercises`);
      return docs.length;
    }
    return existingCount;
  } catch (error) {
    console.error("Failed to seed standard exercises:", error.message);
    return 0;
  }
};

/**
 * Retrieves exercises matching filter criteria for the given user.
 */
const getExercises = async (filters = {}, userId = null) => {
  const queryConditions = [];

  // Visibility / Custom ownership condition
  if (filters.isCustom === "true" || filters.isCustom === true) {
    queryConditions.push({ isCustom: true, userId });
  } else if (filters.isCustom === "false" || filters.isCustom === false) {
    queryConditions.push({ isCustom: false });
  } else {
    // Both standard exercises and user-created custom exercises
    if (userId) {
      queryConditions.push({
        $or: [{ isCustom: false }, { isCustom: true, userId }],
      });
    } else {
      queryConditions.push({ isCustom: false });
    }
  }

  // Primary muscle filter
  if (filters.primaryMuscle) {
    queryConditions.push({ primaryMuscle: filters.primaryMuscle });
  }

  // Equipment filter
  if (filters.equipment) {
    queryConditions.push({ equipment: filters.equipment });
  }

  // Category filter
  if (filters.category) {
    queryConditions.push({ category: filters.category });
  }

  // Difficulty filter
  if (filters.difficulty) {
    queryConditions.push({ difficulty: filters.difficulty });
  }

  // Text search on exercise name
  if (filters.search && typeof filters.search === "string" && filters.search.trim()) {
    queryConditions.push({
      name: { $regex: filters.search.trim(), $options: "i" },
    });
  }

  const finalQuery =
    queryConditions.length > 1
      ? { $and: queryConditions }
      : queryConditions[0] || {};

  return await Exercise.find(finalQuery).sort({ name: 1 });
};

/**
 * Retrieves a single exercise by ID, checking authorization if it is custom.
 */
const getExerciseById = async (id, userId = null) => {
  const exercise = await Exercise.findById(id);
  if (!exercise) {
    return null;
  }

  if (exercise.isCustom) {
    if (!userId || exercise.userId.toString() !== userId.toString()) {
      return null;
    }
  }

  return exercise;
};

/**
 * Creates a new user-owned custom exercise.
 */
const createCustomExercise = async (exerciseData, userId) => {
  return await Exercise.create({
    ...exerciseData,
    isCustom: true,
    userId,
  });
};

/**
 * Deletes a user-owned custom exercise.
 */
const deleteCustomExercise = async (id, userId) => {
  const exercise = await Exercise.findById(id);
  if (!exercise) {
    const error = new Error("Exercise not found");
    error.statusCode = 404;
    throw error;
  }

  if (!exercise.isCustom) {
    const error = new Error("Standard system exercises cannot be deleted");
    error.statusCode = 403;
    throw error;
  }

  if (exercise.userId.toString() !== userId.toString()) {
    const error = new Error("Unauthorized to delete this exercise");
    error.statusCode = 403;
    throw error;
  }

  await Exercise.findByIdAndDelete(id);
  return { message: "Exercise deleted successfully" };
};

module.exports = {
  seedStandardExercises,
  getExercises,
  getExerciseById,
  createCustomExercise,
  deleteCustomExercise,
};
