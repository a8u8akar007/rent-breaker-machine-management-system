const express = require("express");
const router = express.Router();

const {
  createRental,
  getAllRentals,
  updateRentalStatus,
  deleteRental,
} = require("../controllers/rentalController");
const { protect, admin } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

// Routes for /api/rentals
router.get("/", protect, getAllRentals);
router.post("/", protect, validate(['machineId', 'customerId', 'startDate', 'endDate']), createRental);
router.put("/:id", protect, admin, updateRentalStatus);
router.delete("/:id", protect, admin, deleteRental);

module.exports = router;
