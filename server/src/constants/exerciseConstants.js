const { AVAILABLE_EQUIPMENT } = require("./profileConstants");

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Core / Abs",
  "Full Body",
];

const EXERCISE_CATEGORIES = [
  "Strength",
  "Hypertrophy",
  "Calisthenics",
  "Cardio",
  "Flexibility / Mobility",
];

const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const EXERCISE_EQUIPMENT = [
  "None (Bodyweight)",
  ...AVAILABLE_EQUIPMENT,
];

module.exports = {
  MUSCLE_GROUPS,
  EXERCISE_CATEGORIES,
  DIFFICULTY_LEVELS,
  EXERCISE_EQUIPMENT,
};
