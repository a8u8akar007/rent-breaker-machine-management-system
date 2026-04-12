const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// ── ENVIRONMENT & DATABASE ──
dotenv.config();
connectDB();

const app = express();

// ── MIDDLEWARE CONFIGURATION ──
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// ── API ENDPOINTS (REST) ──
app.use("/api/machines", require("./routes/machineRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/rentals", require("./routes/rentalRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// ── HEALTH CHECK ROUTE ──
app.get("/", (req, res) => {
  res.json({ message: "🚀 Rent Breaker Machine Management System API is running!" });
});

const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// ... (other middleware)

// ── ERROR HANDLING ──
app.use(notFound);
app.use(errorHandler);

// ── SERVER ACTIVATION ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});