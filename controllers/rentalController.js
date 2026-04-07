const Rental = require("../models/Rental");
const Machine = require("../models/Machine");

// @desc    Create a new rental
// @route   POST /api/rentals
const createRental = async (req, res) => {
  try {
    const { machineId, customerId, startDate, endDate } = req.body;

    // 1. Fetch machine to get its rental price and status
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    // 2. Check if machine is available
    if (machine.status !== "Available") {
      return res.status(400).json({ message: `Machine is currently ${machine.status}` });
    }

    // 3. Calculate total rent
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure end date is after start date
    if (end <= start) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days

    const totalRent = daysDiff * machine.rentalPricePerDay;

    // 4. Create the rental
    const rental = await Rental.create({
      machineId,
      customerId,
      startDate,
      endDate,
      totalRent,
    });

    // 5. Update machine status to "Rented"
    machine.status = "Rented";
    await machine.save();

    res.status(201).json(rental);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all rentals
// @route   GET /api/rentals
const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("machineId", "name capacity location")
      .populate("customerId", "name phone cnic");
    
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update rental status
// @route   PUT /api/rentals/:id
const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // If status is being updated to "Completed", free up the machine
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
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRental,
  getAllRentals,
  updateRentalStatus,
};
