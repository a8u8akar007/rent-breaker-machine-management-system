const mongoose = require("mongoose");

// Machine Schema - defines the structure of a machine document in MongoDB
const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Machine name is required"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Machine capacity is required"],
    },
    rentalPricePerDay: {
      type: Number,
      required: [true, "Rental price per day is required"],
    },
    status: {
      type: String,
      enum: ["Available", "Rented", "Maintenance"],
      default: "Available",
    },
    location: {
      type: String,
      required: [true, "Machine location is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Machine", machineSchema);
