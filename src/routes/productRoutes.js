const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Public: Get all products
router.get("/", getAllProducts);

// Public: Get a single product by ID
router.get("/:id", getProductById);

// Admin & Vendors: Create product
router.post("/", protect, authorize("admin", "vendor"), createProduct);

// Admin & Vendors: Update product
router.put("/:id", protect, authorize("admin", "vendor"), updateProduct);

// Admin & Vendors: Delete product
router.delete("/:id", protect, authorize("admin", "vendor"), deleteProduct);

module.exports = router;
