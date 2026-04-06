const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes - checks for valid JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next(); // Move to the next middleware / route handler
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token is invalid" });
  }
};

module.exports = { protect };
