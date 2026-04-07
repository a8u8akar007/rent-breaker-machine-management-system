const express = require("express");
const router = express.Router();

// Import controller functions
const { getStats } = require("../controllers/reportController");
const { protect, admin } = require("../middleware/authMiddleware");

// Routes for /api/reports
router.get("/stats", protect, admin, getStats); // GET /api/reports/stats (Admin only)

module.exports = router;
