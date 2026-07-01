const { body } = require("express-validator");

const {
  FITNESS_GOALS,
  WORKOUT_LOCATIONS,
  DIET_PREFERENCES,
  ACTIVITY_LEVELS,
  AVAILABLE_EQUIPMENT,
} = require("../constants/profileConstants");

const profileValidationRules = [
  body("height")
    .isFloat({ min: 100, max: 250 })
    .withMessage("Height must be between 100 and 250 cm"),

  body("weight")
    .isFloat({ min: 25, max: 350 })
    .withMessage("Weight must be between 25 and 350 kg"),

  body("fitnessGoal")
    .isIn(FITNESS_GOALS)
    .withMessage("Invalid fitness goal"),

  body("experienceMonths")
    .isInt({ min: 0, max: 600 })
    .withMessage("Invalid experience"),

  body("workoutLocation")
    .isIn(WORKOUT_LOCATIONS)
    .withMessage("Invalid workout location"),

  body("workoutDaysPerWeek")
    .isInt({ min: 1, max: 7 })
    .withMessage("Workout days must be between 1 and 7"),

  body("workoutDuration")
    .isInt({ min: 15, max: 180 })
    .withMessage("Workout duration must be between 15 and 180 minutes"),

  body("dietPreference")
    .isIn(DIET_PREFERENCES)
    .withMessage("Invalid diet preference"),

  body("averageSleepHours")
    .isFloat({ min: 1, max: 16 })
    .withMessage("Invalid sleep hours"),

  body("activityLevel")
    .isIn(ACTIVITY_LEVELS)
    .withMessage("Invalid activity level"),

  body("availableEquipment")
    .optional()
    .isArray()
    .withMessage("Equipment must be an array"),

  body("availableEquipment.*")
    .optional()
    .isIn(AVAILABLE_EQUIPMENT)
    .withMessage("Invalid equipment selected"),
];

module.exports = {
  validateCreateProfile: profileValidationRules,
  validateUpdateProfile: profileValidationRules,
};