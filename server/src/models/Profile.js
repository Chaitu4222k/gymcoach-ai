const mongoose = require("mongoose");

const {
  FITNESS_GOALS,
  WORKOUT_LOCATIONS,
  DIET_PREFERENCES,
  ACTIVITY_LEVELS,
  AVAILABLE_EQUIPMENT,
} = require("../constants/profileConstants");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    height: {
      type: Number,
      required: true,
      min: 100,
      max: 250,
    },

    weight: {
      type: Number,
      required: true,
      min: 25,
      max: 350,
    },

    fitnessGoal: {
      type: String,
      enum: FITNESS_GOALS,
      required: true,
    },

    experienceMonths: {
      type: Number,
      required: true,
      min: 0,
      max: 600,
    },

    workoutLocation: {
      type: String,
      enum: WORKOUT_LOCATIONS,
      required: true,
    },

    workoutDaysPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },

    workoutDuration: {
      type: Number,
      required: true,
      min: 15,
      max: 180,
    },

    availableEquipment: {
      type: [String],
      enum: AVAILABLE_EQUIPMENT,
      default: [],
    },

    dietPreference: {
      type: String,
      enum: DIET_PREFERENCES,
      required: true,
    },

    averageSleepHours: {
      type: Number,
      required: true,
      min: 1,
      max: 16,
    },

    activityLevel: {
      type: String,
      enum: ACTIVITY_LEVELS,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);