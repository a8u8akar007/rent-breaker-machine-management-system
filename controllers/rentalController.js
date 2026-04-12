const Rental = require("../models/Rental");
const Machine = require("../models/Machine");

/**
 * ── RENTAL CONTROLLER ──
 * Manages the transition of machines from Available to Rented
 * and handles financial calculations for rental agreements.
 */

// @desc    Create a new rental
// @route   POST /api/rentals
const createRental = async (req, res, next) => {
  try {
    const { machineId, customerId, startDate, endDate, advancePayment = 0 } = req.body;

    const machine = await Machine.findById(machineId);
    if (!machine) {
      res.status(404);
      return next(new Error("Machine not found"));
    }

    if (machine.status !== "Available") {
      res.status(400);
      return next(new Error(`Machine is currently ${machine.status}`));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      res.status(400);
      return next(new Error("End date must be after start date"));
    }

    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

    const totalRent = daysDiff * machine.rentalPricePerDay;
    const remainingBalance = totalRent - advancePayment;

    const rental = await Rental.create({
      machineId,
      customerId,
      startDate,
      endDate,
      totalRent,
      advancePayment,
      remainingBalance,
    });

    machine.status = "Rented";
    await machine.save();

    res.status(201).json(rental);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Get all rentals
// @route   GET /api/rentals
const getAllRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find()
      .populate("machineId", "name capacity location")
      .populate("customerId", "name phone cnic");
    
    res.status(200).json(rentals);
  } catch (error) {
    next(error);
  }
};

// @desc    Update rental status
// @route   PUT /api/rentals/:id
const updateRentalStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      res.status(404);
      return next(new Error("Rental not found"));
    }

    if (status === "Completed" && rental.status !== "Completed") {
      const machine = await Machine.findById(rental.machineId);
      if (machine) {
        machine.status = "Available";
        await machine.save();
      }
    }

    rental.status = status;
    await rental.save();

    res.status(200).json(rental);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Delete a rental
// @route   DELETE /api/rentals/:id
const deleteRental = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      res.status(404);
      return next(new Error("Rental record not found"));
    }
    
    // If deleting an active rental, free the machine
    if (rental.status !== "Completed") {
      const machine = await Machine.findById(rental.machineId);
      if (machine) {
        machine.status = "Available";
        await machine.save();
      }
    }

    await Rental.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Rental deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRental,
  getAllRentals,
  updateRentalStatus,
  deleteRental
};
