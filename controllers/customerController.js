const Customer = require("../models/Customer");

// @desc    Get all customers
// @route   GET /api/customers
const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new customer
// @route   POST /api/customers
const addCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      res.status(404);
      return next(new Error("Customer not found"));
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      res.status(404);
      return next(new Error("Customer not found"));
    }
    res.status(200).json({ message: "Customer removed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
};
