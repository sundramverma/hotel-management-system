const express = require("express");
const router = express.Router();
const Room = require("../models/room");

// 🔥 CONFIRM ROUTE LOADED
console.log("✅ roomRoute.js LOADED");

// ✅ GET ALL ROOMS
// URL: http://localhost:5000/api/rooms
router.get("/", async (req, res) => {
  console.log("👉 GET /api/rooms HIT");
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);
  } catch (error) {
    console.error("❌ Error fetching rooms:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET ROOM BY ID
// URL: POST http://localhost:5000/api/rooms/getroombyid
router.post("/getroombyid", async (req, res) => {
  try {
    const { roomid } = req.body;

    if (!roomid) {
      return res.status(400).json({ message: "roomid is required" });
    }

    const room = await Room.findById(roomid);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("❌ Error fetching room:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
