const mongoose = require("mongoose");

/**
 * 🚜 MACHINE MODEL
 * This model represents a heavy equipment unit in our fleet.
 * It uses Mongoose Schema to define data structure, types, and validations.
 */
const machineSchema = new mongoose.Schema(
  {
    // Descriptive name of the equipment (e.g., "Caterpillar Excavator 320")
    name: {
      type: String,
      required: [true, "Machine name is required"],
      trim: true,
    },
    // Technical capability or size (e.g., 20 Tons)
    capacity: {
      type: String, // Changed to String to allow units like "20 Tons"
      required: [true, "Machine capacity is required"],
    },
    // Economic value: How much we charge per 24-hour cycle
    rentalPricePerDay: {
      type: Number,
      required: [true, "Rental price per day is required"],
    },
    // Finite state machine implementation: Ensures the unit is in one valid state at a time
    status: {
      type: String,
      enum: ["Available", "Rented", "Maintenance"],
      default: "Available",
    },
    // Physical deployment or warehouse location
    location: {
      type: String,
      required: [true, "Machine location is required"],
      trim: true,
    },
  },
  {
    // Automatically manage createdAt and updatedAt fields for auditing
    timestamps: true,
  }
);

module.exports = mongoose.model("Machine", machineSchema);
