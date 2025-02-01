const express = require("express");
const { register, login } = require("../controllers/authController");
const { check } = require("express-validator");
const User = require("../models/User")
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// Validation Rules
const validateUser = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  check("role", "Role must be either 'buyer' or 'vendor'").isIn(["buyer", "vendor"]),
];

// Register Route
router.post("/register", validateUser, register);

// Example Protected Route: Only logged-in users can access this
router.get("/login/profile", protect, (req, res) => {
  res.json({ message: "User profile",  user : req.user });
});

 
// Login Route
router.post("/login", login);
// Example Admin- only Route
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin Dashboard", user : req.user });
});

router.get("/admin/users", protect, authorize("admin") ,async (req, res) => {
  try {
    const users = await User.find(); // Get all users from the database
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users.", error });
  }
});
router.post("/admin/create-staff", protect, authorize("admin"), async (req, res) => {
  const { name, email, password, role } = req.body;

  // Ensure all fields are provided
  if (!name || !email || !password || role !== "staff") {
    return res.status(400).json({ message: "Please provide all fields and set the role as 'staff'" });
  }

  try {
    // Check if the staff user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Staff member already exists" });
    }

    // Create the new staff member
    const staff = new User({
      name,
      email,
      password, // In production, ensure to hash the password using bcrypt or another method
      role: "staff",
    });

    // Save the new staff member
    await staff.save();

    res.status(201).json({ message: "Staff member created successfully", user: staff });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Error creating staff member", error: error.message });
  }
});


module.exports = router;
