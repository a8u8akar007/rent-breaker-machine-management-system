const mongoose = require("mongoose");

// Maintenance Schema
const maintenanceSchema = new mongoose.Schema(
  {
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine", // Reference to the Machine model
      required: [true, "Machine ID is required"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Maintenance date is required"],
    },
    issue: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
    },
    cost: {
      type: Number,
      required: [true, "Maintenance cost is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
