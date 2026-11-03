const { body, query } = require("express-validator");

const {
  MUSCLE_GROUPS,
  EXERCISE_CATEGORIES,
  DIFFICULTY_LEVELS,
  EXERCISE_EQUIPMENT,
} = require("../constants/exerciseConstants");

const validateCreateExercise = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Exercise name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Exercise name must be between 2 and 100 characters"),

  body("category")
    .isIn(EXERCISE_CATEGORIES)
    .withMessage("Invalid exercise category"),

  body("primaryMuscle")
    .isIn(MUSCLE_GROUPS)
    .withMessage("Invalid primary muscle group"),

  body("secondaryMuscles")
    .optional()
    .isArray()
    .withMessage("Secondary muscles must be an array"),

  body("secondaryMuscles.*")
    .optional()
    .isIn(MUSCLE_GROUPS)
    .withMessage("Invalid secondary muscle selected"),

  body("equipment")
    .isIn(EXERCISE_EQUIPMENT)
    .withMessage("Invalid equipment selected"),

  body("difficulty")
    .optional()
    .isIn(DIFFICULTY_LEVELS)
    .withMessage("Invalid difficulty level"),

  body("instructions")
    .optional()
    .isArray()
    .withMessage("Instructions must be an array of steps"),

  body("instructions.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each instruction step must be a non-empty string"),
];

const validateExerciseQuery = [
  query("primaryMuscle")
    .optional()
    .isIn(MUSCLE_GROUPS)
    .withMessage("Invalid muscle group filter"),

  query("equipment")
    .optional()
    .isIn(EXERCISE_EQUIPMENT)
    .withMessage("Invalid equipment filter"),

  query("category")
    .optional()
    .isIn(EXERCISE_CATEGORIES)
    .withMessage("Invalid category filter"),

  query("difficulty")
    .optional()
    .isIn(DIFFICULTY_LEVELS)
    .withMessage("Invalid difficulty filter"),

  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),
];

module.exports = {
  validateCreateExercise,
  validateExerciseQuery,
};
