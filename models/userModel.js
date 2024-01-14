const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalalid Email"],
    trim: true,
  },
  password: {
    type: String,
    required: true,
    min: [6, "Password has to be at least 6 characters"],
    max: [12, "Passwword max length is 12 characters"],
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
