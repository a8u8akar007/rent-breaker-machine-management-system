const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} = require("../controllers/machineController");
const { protect } = require("../middleware/authMiddleware");

// Routes for /api/machines
router.get("/", protect, getAllMachines);         // GET    /api/machines
router.get("/:id", protect, getMachineById);     // GET    /api/machines/:id
router.post("/", protect, createMachine);        // POST   /api/machines
router.put("/:id", protect, updateMachine);      // PUT    /api/machines/:id
router.delete("/:id", protect, deleteMachine);   // DELETE /api/machines/:id

module.exports = router;
