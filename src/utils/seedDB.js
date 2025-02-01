const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();  

const dbURI = process.env.MONGO_URI; // Correctly accessing the MONGO_URI from .env
console.log(dbURI);  // To check if it's correctly loaded

const seedDatabase = async () => {
  try {
    if (!dbURI) {
      throw new Error("MONGO_URI is not defined in the .env file.");
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Insert Super Admin
    const superAdmin = new User({
      name: "Super Admin",
      email: "admin@example.com",
      password: "securepassword",
      role: "admin",
    });
    await superAdmin.save();

    console.log("Super Admin added!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase()
