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

// Routes for /api/machines
router.get("/", getAllMachines);         // GET    /api/machines
router.get("/:id", getMachineById);     // GET    /api/machines/:id
router.post("/", createMachine);        // POST   /api/machines
router.put("/:id", updateMachine);      // PUT    /api/machines/:id
router.delete("/:id", deleteMachine);   // DELETE /api/machines/:id

module.exports = router;
