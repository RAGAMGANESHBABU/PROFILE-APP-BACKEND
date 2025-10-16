// ✅ Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const app = express();
app.use(cors());

// ✅ Increased payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Get MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ✅ Validate required environment variables
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env file");
  process.exit(1);
}

// ✅ MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Create new user (with optional profilePic)
app.post("/api/users", async (req, res) => {
  try {
    const { firstName, lastName, email, password, profilePic } = req.body;
    const user = new User({ firstName, lastName, email, password, profilePic });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// ✅ Fetch first user (if any)
app.get("/api/users", async (req, res) => {
  try {
    const user = await User.findOne();
    if (user) res.status(200).json(user);
    else res.status(404).json({ message: "No user found" });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

// ✅ Update profile picture
app.put("/api/users/:id", async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePic },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile picture", error: err.message });
  }
});

// ✅ Delete user by ID (for logout functionality)
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ 
      message: "Error deleting user", 
      error: err.message 
    });
  }
});

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// ✅ Start server with environment variable PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
});
