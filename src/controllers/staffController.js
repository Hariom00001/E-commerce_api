const Product = require('../models/Product');
const User = require('../models/User');

// Staff can view products for assigned vendor
exports.viewProducts = async (req, res) => {
  try {
    const staffId = req.user.id;
    const staff = await User.findById(staffId);

    if (staff.role !== 'staff') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const vendorProducts = await Product.find();
    res.json(vendorProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Staff can add products for assigned vendor
exports.addProduct = async (req, res) => {
    try {
        const { name, description, category, priceOld, priceNew, vendorId, imageUrl, scheduledStartDate, expiryDate } = req.body;
    
        // Fetch all vendors to present the option to the staff
        const vendors = await User.find({ role: "vendor" });
    
        // Check if the vendor exists
        if (!vendors.some(vendor => vendor._id.toString() === vendorId)) {
          return res.status(400).json({ message: "Invalid vendor selection." });
        }
    
        const newProduct = new Product({
          name,
          description,
          category,
          priceOld,
          priceNew,
          vendor: vendorId, // Set the selected vendor
          imageUrl,
          scheduledStartDate,
          expiryDate,
          uniqueUrl: `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
        });
    
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully.", product: newProduct });
      } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Error adding product.", error: error.message });
      }
    
};


