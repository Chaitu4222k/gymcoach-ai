const { validationResult } = require("express-validator");
const {
  getUserRoutines,
  getActiveRoutine,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  setActiveRoutine,
  generateStarterRoutineRecommendation,
} = require("../services/routineService");

/**
 * Get all routines for authenticated user.
 */
const getUserRoutinesController = async (req, res) => {
  try {
    const routines = await getUserRoutines(req.user.id);
    res.json(routines);
  } catch (error) {
    console.error("Error fetching routines:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get currently active routine.
 */
const getActiveRoutineController = async (req, res) => {
  try {
    const routine = await getActiveRoutine(req.user.id);
    if (!routine) {
      return res.status(404).json({ message: "No active routine found" });
    }
    res.json(routine);
  } catch (error) {
    console.error("Error fetching active routine:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get routine by ID.
 */
const getRoutineByIdController = async (req, res) => {
  try {
    const routine = await getRoutineById(req.params.id, req.user.id);
    res.json(routine);
  } catch (error) {
    console.error("Error fetching routine by ID:", error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 * Create a new routine.
 */
const createRoutineController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const routine = await createRoutine(req.body, req.user.id);
    res.status(201).json({
      message: "Workout routine created successfully",
      routine,
    });
  } catch (error) {
    console.error("Error creating routine:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update an existing routine.
 */
const updateRoutineController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const routine = await updateRoutine(req.params.id, req.body, req.user.id);
    res.json({
      message: "Workout routine updated successfully",
      routine,
    });
  } catch (error) {
    console.error("Error updating routine:", error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 * Delete a routine.
 */
const deleteRoutineController = async (req, res) => {
  try {
    const result = await deleteRoutine(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting routine:", error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 * Set a routine as active.
 */
const setActiveRoutineController = async (req, res) => {
  try {
    const routine = await setActiveRoutine(req.params.id, req.user.id);
    res.json({
      message: "Routine set as active",
      routine,
    });
  } catch (error) {
    console.error("Error setting active routine:", error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 * Get starter routine recommendation based on profile.
 */
const getRoutineRecommendationsController = async (req, res) => {
  try {
    const recommendation = await generateStarterRoutineRecommendation(req.user.id);
    res.json(recommendation);
  } catch (error) {
    console.error("Error generating routine recommendation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getUserRoutinesController,
  getActiveRoutineController,
  getRoutineByIdController,
  createRoutineController,
  updateRoutineController,
  deleteRoutineController,
  setActiveRoutineController,
  getRoutineRecommendationsController,
};
