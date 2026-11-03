const { body, param, query } = require("express-validator");

const validateCreateWorkoutLog = [
  body("routineName")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Routine name cannot exceed 100 characters"),

  body("dayName")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Day name cannot exceed 100 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),

  body("durationMinutes")
    .isInt({ min: 1, max: 480 })
    .withMessage("Workout duration must be an integer between 1 and 480 minutes"),

  body("exercises")
    .isArray({ min: 1 })
    .withMessage("At least one exercise must be recorded in the workout log"),

  body("exercises.*.exerciseName")
    .trim()
    .notEmpty()
    .withMessage("Exercise name is required for each logged exercise"),

  body("exercises.*.sets")
    .isArray({ min: 1 })
    .withMessage("Each exercise must contain at least one completed set"),

  body("exercises.*.sets.*.setNumber")
    .isInt({ min: 1 })
    .withMessage("Set number must be an integer of 1 or greater"),

  body("exercises.*.sets.*.reps")
    .isInt({ min: 0, max: 200 })
    .withMessage("Reps must be an integer between 0 and 200"),

  body("exercises.*.sets.*.weight")
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage("Weight must be between 0 and 1000 kg"),

  body("exercises.*.sets.*.rpe")
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 10 })
    .withMessage("RPE must be between 1 and 10"),

  body("exercises.*.sets.*.completed")
    .optional()
    .isBoolean()
    .withMessage("Set completed must be a boolean"),

  body("feeling")
    .optional()
    .isIn(["Great", "Good", "Normal", "Tired", "Exhausted"])
    .withMessage("Invalid feeling selection"),

  body("notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

const validateLogIdParam = [
  param("id")
    .isMongoId()
    .withMessage("Invalid workout log ID"),
];

const validateWorkoutQuery = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];

module.exports = {
  validateCreateWorkoutLog,
  validateLogIdParam,
  validateWorkoutQuery,
};
