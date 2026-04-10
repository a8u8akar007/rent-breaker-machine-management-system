const Machine = require("../models/Machine");
const Rental = require("../models/Rental");
const Customer = require("../models/Customer");
const Maintenance = require("../models/Maintenance");

// @desc    Get system overview report
// @route   GET /api/reports/stats
const getStats = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalMachines = await Machine.countDocuments();
    const totalRentals = await Rental.countDocuments({ status: "Active" });
    const totalCustomers = await Customer.countDocuments();

    // 2. Revenue (Last 6 Months)
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const revenueData = await Rental.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: "Completed"
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          revenue: { $sum: "$totalRent" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 3. Status Distribution (Utilization)
    const machineStatus = await Machine.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Total Lifetime Revenue
    const lifetimeRevenue = await Rental.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalRent" }
        }
      }
    ]);

    // 5. Recent Activity (Combining last 5 from key collections)
    const [lastRentals, lastMaintenance, lastCustomers] = await Promise.all([
      Rental.find().sort({ createdAt: -1 }).limit(5).populate('machineId customerId'),
      Maintenance.find().sort({ createdAt: -1 }).limit(5).populate('machineId'),
      Customer.find().sort({ createdAt: -1 }).limit(5)
    ]);

    // Format activity
    const activity = [
      ...lastRentals.map(r => ({
        icon: '📋',
        text: `${r.machineId?.name || 'Machine'} rented to ${r.customerId?.name || 'Customer'}`,
        time: r.createdAt,
        type: 'rental'
      })),
      ...lastMaintenance.map(m => ({
        icon: '🔧',
        text: `${m.machineId?.name || 'Machine'} service logged: ${m.issue?.substring(0, 30)}...`,
        time: m.createdAt,
        type: 'maint'
      })),
      ...lastCustomers.map(c => ({
        icon: '👤',
        text: `New customer ${c.name} onboarded`,
        time: c.createdAt,
        type: 'customer'
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 8);

    res.status(200).json({
      totalMachines,
      activeRentals: totalRentals,
      totalCustomers,
      totalRevenue: lifetimeRevenue[0]?.total || 0,
      revenueHistory: revenueData,
      utilization: machineStatus,
      recentActivity: activity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
