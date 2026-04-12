const Maintenance = require("../models/Maintenance");
const Machine = require("../models/Machine");

// @desc    Add a new maintenance record
// @route   POST /api/maintenance
const addMaintenance = async (req, res, next) => {
  try {
    const { machineId, issue, cost, date } = req.body;
    
    const maintenance = await Maintenance.create({ machineId, issue, cost, date });
    
    // Optionally update machine status to Maintenance automatically
    const machine = await Machine.findById(machineId);
    if (machine) {
      machine.status = "Maintenance";
      await machine.save();
    }

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Get all maintenance records
// @route   GET /api/maintenance
const getMaintenanceRecords = async (req, res, next) => {
  try {
    const records = await Maintenance.find().populate("machineId", "name capacity location");
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a maintenance record
// @route   DELETE /api/maintenance/:id
const deleteMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findByIdAndDelete(req.params.id);
    if (!record) {
      res.status(404);
      return next(new Error("Record not found"));
    }
    res.status(200).json({ message: "Maintenance record removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMaintenance,
  getMaintenanceRecords,
  deleteMaintenance
};
