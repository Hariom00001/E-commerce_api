const Product = require("../models/Product");
const slugify = require("slugify");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, priceOld, priceNew, freeDelivery, deliveryAmount, scheduledStartDate } = req.body;
    const vendor = req.user._id;

    // Ensure expiry date is set to 7 days after start date
    const expiryDate = new Date(scheduledStartDate);
    expiryDate.setDate(expiryDate.getDate() + 7);

    const uniqueUrl = slugify(name, { lower: true, strict: true });

    const product = await Product.create({
      name,
      description,
      category,
      priceOld,
      priceNew,
      vendor,
      imageUrl: req.body.imageUrl,
      scheduledStartDate,
      expiryDate,
      freeDelivery,
      deliveryAmount,
      uniqueUrl,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all products (Public)
// Get all products with search and pagination
exports.getAllProducts = async (req, res) => {
    try {
      let { page = 1, limit = 10, search = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
  
      const query = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } }, // Search by product name
              { description: { $regex: search, $options: "i" } }, // Search by description
              { category: { $regex: search, $options: "i" } }, // Search by category
            ],
          }
        : {};
  
      const totalProducts = await Product.countDocuments(query);
      const products = await Product.find(query)
        .populate("vendor", "name email")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first
  
      res.status(200).json({
        success: true,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        products,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("vendor", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user is the vendor or admin
    if (req.user.role !== "admin" && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user is the vendor or admin
    if (req.user.role !== "admin" && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await product.remove();
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
