const Maintenance = require("../models/Maintenance");

// @desc    Add a new maintenance record
// @route   POST /api/maintenance
const addMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.create(req.body);
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all maintenance records
// @route   GET /api/maintenance
const getMaintenanceRecords = async (req, res) => {
  try {
    const records = await Maintenance.find().populate("machineId", "name capacity location");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMaintenance,
  getMaintenanceRecords,
};
