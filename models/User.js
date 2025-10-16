const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  profilePic: String, // ✅ added to store Base64 image
});

module.exports = mongoose.model("User", userSchema);
