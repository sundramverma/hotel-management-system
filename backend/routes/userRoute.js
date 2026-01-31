const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/user");
const Booking = require("../models/booking");
const Room = require("../models/room");

// 🔥 CONFIRM ROUTE LOADED
console.log("✅ userRoute.js LOADED");


// =======================
// 🔥 REGISTER USER
// =======================
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


// =======================
// 🔥 LOGIN USER
// =======================
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


// =======================
// 🔥 DELETE USER + BOOKINGS + ROOM CLEANUP
// =======================
router.post("/delete", async (req, res) => {
  console.log("👉 DELETE BODY:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userid = user._id.toString();

    // 🔥 1. FIND USER BOOKINGS
    const bookings = await Booking.find({ userid });

    // 🔥 2. REMOVE BOOKINGS FROM ROOMS
    for (const booking of bookings) {
      const room = await Room.findById(booking.roomid);
      if (room) {
        room.currentbookings = room.currentbookings.filter(
          (b) => b.bookingid !== booking._id.toString()
        );
        await room.save();
      }
    }

    // 🔥 3. DELETE BOOKINGS
    await Booking.deleteMany({ userid });

    // 🔥 4. DELETE USER
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: "User, bookings and room data deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Account deletion failed",
    });
  }
});

module.exports = router;
