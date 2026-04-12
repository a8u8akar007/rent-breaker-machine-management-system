const express = require("express");
const router = express.Router();

const {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { protect, admin } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

// Routes for /api/customers
router.get("/", protect, getAllCustomers);
router.post("/", protect, admin, validate(['name', 'phone']), addCustomer);
router.put("/:id", protect, admin, updateCustomer);
router.delete("/:id", protect, admin, deleteCustomer);

module.exports = router;
