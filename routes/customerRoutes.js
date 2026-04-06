const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getAllCustomers,
  addCustomer,
  updateCustomer,
} = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");

// Routes for /api/customers
router.get("/", protect, getAllCustomers);         // GET    /api/customers
router.post("/", protect, addCustomer);            // POST   /api/customers
router.put("/:id", protect, updateCustomer);       // PUT    /api/customers/:id

module.exports = router;
