const mongoose = require("mongoose");
const { MUSCLE_GROUPS } = require("../constants/exerciseConstants");

const setLogSchema = new mongoose.Schema(
  {
    setNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    weight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000,
    },
    rpe: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const exerciseLogSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      default: null,
    },
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    primaryMuscle: {
      type: String,
      enum: MUSCLE_GROUPS,
      default: "Full Body",
    },
    sets: {
      type: [setLogSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
  },
  { _id: true }
);

const workoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    routineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutRoutine",
      default: null,
    },
    routineName: {
      type: String,
      trim: true,
      default: "Custom Session",
    },
    dayName: {
      type: String,
      trim: true,
      default: "General Workout",
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
      max: 480,
      default: 45,
    },
    totalVolumeKg: {
      type: Number,
      default: 0,
      min: 0,
    },
    exercises: {
      type: [exerciseLogSchema],
      default: [],
    },
    feeling: {
      type: String,
      enum: ["Great", "Good", "Normal", "Tired", "Exhausted"],
      default: "Good",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

workoutLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("WorkoutLog", workoutLogSchema);
