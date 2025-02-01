require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/productRoutes");
const staffRoutes = require("./src/routes/staffRoutes")


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use('/api/auth/staff', staffRoutes);
app.use("/api/auth/products", productRoutes);

app.get("/", (req, res) => {
  res.send("E-commerce API is running...");
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
