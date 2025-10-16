const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const app = express();
app.use(cors());

// ✅ FIXED: Increased payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://gannu0316:Gannu123*@cluster0.sftzjhf.mongodb.net/profileApp?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile picture", error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
