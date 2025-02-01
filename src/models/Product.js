const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    priceOld: {
      type: Number,
      required: [true, "Old price is required"],
    },
    priceNew: {
      type: Number,
      required: [true, "New price is required"],
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: {
      type: String,
      required: [true, "Product image is required"],
    },
    scheduledStartDate: {
      type: Date,
      required: [true, "Scheduled start date is required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    deliveryAmount: {
      type: Number,
      default: 0,
    },
    uniqueUrl: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Add a method to generate unique URL
productSchema.pre("save", function (next) {
  if (this.name) {
    this.uniqueUrl = `/products/${this.name.replace(/\s+/g, "-").toLowerCase()}`;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
