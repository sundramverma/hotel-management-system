const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");

// 🔥 REGISTER
router.post("/register", async (req, res) => {
  console.log("👉 REGISTER BODY:", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// 🔥 LOGIN
router.post("/login", async (req, res) => {
  console.log("👉 LOGIN BODY:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

module.exports = router;
