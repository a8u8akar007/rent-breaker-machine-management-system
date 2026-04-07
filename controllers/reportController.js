const Machine = require("../models/Machine");
const Rental = require("../models/Rental");

// @desc    Get system overview report
// @route   GET /api/reports/stats
const getStats = async (req, res) => {
  try {
    // 1. Count total machines
    const totalMachines = await Machine.countDocuments();

    // 2. Count total rentals
    const totalRentals = await Rental.countDocuments();

    // 3. Calculate total revenue (sum of all totalRent fields)
    const revenueData = await Rental.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalRent" },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      totalMachines,
      totalRentals,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
