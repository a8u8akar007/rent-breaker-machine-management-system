const express = require("express");
const router = express.Router();

const {
  addMaintenance,
  getMaintenanceRecords,
  deleteMaintenance,
} = require("../controllers/maintenanceController");
const { protect, admin } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

// Routes for /api/maintenance
router.get("/", protect, getMaintenanceRecords);
router.post("/", protect, admin, validate(['machineId', 'issue', 'cost']), addMaintenance);
router.delete("/:id", protect, admin, deleteMaintenance);

module.exports = router;
