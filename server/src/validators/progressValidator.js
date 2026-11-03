const { body, param, query } = require("express-validator");

const validateLogBodyWeight = [
  body("weight")
    .isFloat({ min: 25, max: 350 })
    .withMessage("Weight must be a valid number between 25 and 350 kg"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),

  body("notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 250 })
    .withMessage("Notes cannot exceed 250 characters"),
];

const validateWeightIdParam = [
  param("id")
    .isMongoId()
    .withMessage("Invalid body weight log ID"),
];

const validateTimeframeQuery = [
  query("timeframe")
    .optional()
    .isIn(["4weeks", "8weeks", "12weeks", "all"])
    .withMessage("Timeframe must be one of: 4weeks, 8weeks, 12weeks, all"),
];

module.exports = {
  validateLogBodyWeight,
  validateWeightIdParam,
  validateTimeframeQuery,
};
