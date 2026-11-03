const { body, param } = require("express-validator");
const { FITNESS_GOALS } = require("../constants/profileConstants");
const { MUSCLE_GROUPS } = require("../constants/exerciseConstants");

const validateCreateRoutine = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Routine name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Routine name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("goal")
    .optional()
    .isIn(FITNESS_GOALS)
    .withMessage("Invalid fitness goal"),

  body("difficulty")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Invalid difficulty level"),

  body("daysPerWeek")
    .isInt({ min: 1, max: 7 })
    .withMessage("Days per week must be an integer between 1 and 7"),

  body("days")
    .optional()
    .isArray()
    .withMessage("Days must be an array"),

  body("days.*.dayNumber")
    .optional()
    .isInt({ min: 1, max: 7 })
    .withMessage("Day number must be between 1 and 7"),

  body("days.*.name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Day name must be between 2 and 100 characters"),

  body("days.*.targetMuscleGroups")
    .optional()
    .isArray()
    .withMessage("Target muscle groups must be an array"),

  body("days.*.targetMuscleGroups.*")
    .optional()
    .isIn(MUSCLE_GROUPS)
    .withMessage("Invalid muscle group specified"),

  body("days.*.isRestDay")
    .optional()
    .isBoolean()
    .withMessage("isRestDay must be a boolean"),

  body("days.*.exercises")
    .optional()
    .isArray()
    .withMessage("Exercises must be an array"),

  body("days.*.exercises.*.exerciseName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Exercise name is required for each scheduled exercise"),

  body("days.*.exercises.*.targetSets")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Target sets must be between 1 and 20"),

  body("days.*.exercises.*.targetRepsMin")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Minimum target reps must be between 1 and 100"),

  body("days.*.exercises.*.targetRepsMax")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Maximum target reps must be between 1 and 100"),

  body("days.*.exercises.*.targetRpe")
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 10 })
    .withMessage("Target RPE must be between 1 and 10"),

  body("days.*.exercises.*.restSeconds")
    .optional()
    .isInt({ min: 15, max: 600 })
    .withMessage("Rest seconds must be between 15 and 600"),

  body("days.*.exercises.*.notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 250 })
    .withMessage("Exercise notes cannot exceed 250 characters"),
];

const validateUpdateRoutine = [
  param("id")
    .isMongoId()
    .withMessage("Invalid routine ID"),

  ...validateCreateRoutine,
];

module.exports = {
  validateCreateRoutine,
  validateUpdateRoutine,
};
