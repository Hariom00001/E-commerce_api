const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to check if the user has the required role
const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId);

      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Access Denied" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
};

module.exports = { authorizeRoles };
