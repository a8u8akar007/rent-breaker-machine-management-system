const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// --- Routes ---
app.use("/api/machines", require("./routes/machineRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/rentals", require("./routes/rentalRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// Test route - check if server is running
app.get("/", (req, res) => {
  res.json({ message: "🚀 Rent Breaker Machine Management System API is running!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
