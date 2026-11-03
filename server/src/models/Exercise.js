const mongoose = require("mongoose");

const {
  MUSCLE_GROUPS,
  EXERCISE_CATEGORIES,
  DIFFICULTY_LEVELS,
  EXERCISE_EQUIPMENT,
} = require("../constants/exerciseConstants");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: EXERCISE_CATEGORIES,
      required: true,
    },
    primaryMuscle: {
      type: String,
      enum: MUSCLE_GROUPS,
      required: true,
    },
    secondaryMuscles: {
      type: [String],
      enum: MUSCLE_GROUPS,
      default: [],
    },
    equipment: {
      type: String,
      enum: EXERCISE_EQUIPMENT,
      required: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      default: "Beginner",
    },
    instructions: {
      type: [String],
      default: [],
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

exerciseSchema.index({ primaryMuscle: 1, equipment: 1 });
exerciseSchema.index({ userId: 1, isCustom: 1 });
exerciseSchema.index({ name: "text" });

module.exports = mongoose.model("Exercise", exerciseSchema);
