const express = require("express");
const router = express.Router();

// Import controller functions
const {
  addMaintenance,
  getMaintenanceRecords,
} = require("../controllers/maintenanceController");
const { protect, admin } = require("../middleware/authMiddleware");

// Routes for /api/maintenance
router.post("/", protect, admin, addMaintenance);    // POST /api/maintenance (Admin only)
router.get("/", protect, getMaintenanceRecords);    // GET  /api/maintenance

module.exports = router;
