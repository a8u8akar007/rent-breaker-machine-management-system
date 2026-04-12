const Machine = require("../models/Machine");

// ── GET: FETCH ALL MACHINES ──
const getAllMachines = async (req, res, next) => {
  try {
    const machines = await Machine.find();
    res.status(200).json(machines);
  } catch (error) {
    next(error);
  }
};

// ── GET: FETCH SINGLE MACHINE BY ID ──
const getMachineById = async (req, res, next) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      res.status(404);
      return next(new Error("Machine not found"));
    }

    res.status(200).json(machine);
  } catch (error) {
    next(error);
  }
};

// ── POST: REGISTER NEW MACHINE ──
const createMachine = async (req, res, next) => {
  try {
    const machine = await Machine.create(req.body);
    res.status(201).json(machine);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// ── PUT: UPDATE MACHINE SPECIFICATIONS ──
const updateMachine = async (req, res, next) => {
  try {
    const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!machine) {
      res.status(404);
      return next(new Error("Machine not found"));
    }

    res.status(200).json(machine);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// ── DELETE: REMOVE MACHINE FROM SYSTEM ──
const deleteMachine = async (req, res, next) => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id);

    if (!machine) {
      res.status(404);
      return next(new Error("Machine not found"));
    }

    res.status(200).json({ message: "Machine deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
