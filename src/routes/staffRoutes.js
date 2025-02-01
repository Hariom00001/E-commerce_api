const express = require('express');
const router = express.Router();
const User = require("../models/User")
const { viewProducts, addProduct } = require('../controllers/staffController');
const { protect, authorize} = require('../middlewares/authMiddleware');

// Route to view products
router.get('/products', protect, authorize("staff"), viewProducts);

// Route to add products
router.post('/products', protect, authorize("staff"), addProduct);

router.get('/staff/vendors', protect, authorize('staff'), async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('name ,_id');  // Get only name and _id of vendors
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Error fetching vendors.", error: error.message });
  }
});
module.exports = router;
