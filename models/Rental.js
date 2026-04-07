const mongoose = require("mongoose");

// Rental Schema
const rentalSchema = new mongoose.Schema(
  {
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine", // Reference to the Machine model
      required: [true, "Machine ID is required"],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Reference to the Customer model
      required: [true, "Customer ID is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalRent: {
      type: Number,
      required: [true, "Total rent is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Completed"],
      default: "Pending",
    },
    advancePayment: {
      type: Number,
      default: 0,
    },
    remainingBalance: {
      type: Number,
      required: [true, "Remaining balance is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rental", rentalSchema);
