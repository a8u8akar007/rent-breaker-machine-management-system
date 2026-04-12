const express = require("express");
const router = express.Router();

// ── CONTROLLER INTEGRATION ──
const {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} = require("../controllers/machineController");

// ── SECURITY MIDDLEWARE ──
const { protect, admin } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

/**
 * 🛣 MACHINE API ROUTES
 * Base Path: /api/machines
 */

// [PUBLIC/USER] - Fetch all machines
router.get("/", protect, getAllMachines);

// [PUBLIC/USER] - Fetch specific technical details
router.get("/:id", protect, getMachineById);

// [ADMIN ONLY] - Provision new equipment
router.post("/", protect, admin, validate(['name', 'capacity', 'rentalPricePerDay', 'location']), createMachine);

// [ADMIN ONLY] - Update machine specs
router.put("/:id", protect, admin, updateMachine);

// [ADMIN ONLY] - Decommission a machine
router.delete("/:id", protect, admin, deleteMachine);

module.exports = router;
