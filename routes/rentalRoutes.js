const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createRental,
  getAllRentals,
  updateRentalStatus,
} = require("../controllers/rentalController");
const { protect } = require("../middleware/authMiddleware");

// Routes for /api/rentals
router.post("/", protect, createRental);          // POST /api/rentals
router.get("/", protect, getAllRentals);          // GET  /api/rentals
router.put("/:id", protect, updateRentalStatus);  // PUT  /api/rentals/:id

module.exports = router;
