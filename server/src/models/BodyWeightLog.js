const mongoose = require("mongoose");

const bodyWeightLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 25,
      max: 350,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

bodyWeightLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("BodyWeightLog", bodyWeightLogSchema);
