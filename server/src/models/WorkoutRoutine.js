const mongoose = require("mongoose");
const { FITNESS_GOALS } = require("../constants/profileConstants");
const { MUSCLE_GROUPS } = require("../constants/exerciseConstants");

const routineExerciseSchema = new mongoose.Schema(
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
    targetSets: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 3,
    },
    targetRepsMin: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 8,
    },
    targetRepsMax: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 12,
    },
    targetRpe: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },
    restSeconds: {
      type: Number,
      min: 15,
      max: 600,
      default: 90,
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

const routineDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    targetMuscleGroups: {
      type: [String],
      enum: MUSCLE_GROUPS,
      default: [],
    },
    isRestDay: {
      type: Boolean,
      default: false,
    },
    exercises: {
      type: [routineExerciseSchema],
      default: [],
    },
  },
  { _id: true }
);

const workoutRoutineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    goal: {
      type: String,
      enum: FITNESS_GOALS,
      default: "Build Muscle",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    daysPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
      default: 3,
    },
    days: {
      type: [routineDaySchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

workoutRoutineSchema.index({ userId: 1, isActive: 1 });
workoutRoutineSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("WorkoutRoutine", workoutRoutineSchema);
