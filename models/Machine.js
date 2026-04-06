const mongoose = require("mongoose");

// Machine Schema - defines the structure of a machine document in MongoDB
const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Machine name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Machine type is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance"],
      default: "available",
    },
    rentPrice: {
      type: Number,
      required: [true, "Rent price is required"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("Machine", machineSchema);
