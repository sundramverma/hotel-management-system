const express = require("express");
const router = express.Router();
const Room = require("../models/room");

/**
 * @route   GET /api/rooms/getallrooms
 * @desc    Get all rooms
 */
router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/rooms/getroombyid
 * @desc    Get single room by ID
 */
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

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/rooms/addroom
 * @desc    Add new room (Admin)
 */
router.post("/addroom", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();

    res.status(201).json({
      success: true,
      message: "Room added successfully",
      room: savedRoom,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/rooms/updateroom/:id
 * @desc    Update room (Admin)
 */
router.put("/updateroom/:id", async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/rooms/deleteroom/:id
 * @desc    Delete room (Admin)
 */
router.delete("/deleteroom/:id", async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
