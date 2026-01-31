const express = require("express");
const router = express.Router();
const moment = require("moment");
const Booking = require("../models/booking");
const Room = require("../models/room");

/* ================= CHECK AVAILABILITY ================= */
router.post("/checkavailability", async (req, res) => {
  try {
    const { roomid, fromdate, todate } = req.body;

    const bookings = await Booking.find({ roomid });

    let isAvailable = true;

    for (const booking of bookings) {
      const bookedFrom = moment(booking.fromdate, "DD-MM-YYYY");
      const bookedTo = moment(booking.todate, "DD-MM-YYYY");

      const selectedFrom = moment(fromdate, "DD-MM-YYYY");
      const selectedTo = moment(todate, "DD-MM-YYYY");

      if (
        selectedFrom.isSameOrBefore(bookedTo) &&
        selectedTo.isSameOrAfter(bookedFrom)
      ) {
        isAvailable = false;
        break;
      }
    }

    res.json({ available: isAvailable });
  } catch (err) {
    res.status(500).json({ available: false });
  }
});

/* ================= BOOK ROOM ================= */
router.post("/bookroom", async (req, res) => {
  try {
    console.log("👉 BOOKING BODY:", req.body);

    // 🔥 ENSURE userid is STRING
    const booking = await Booking.create({
      ...req.body,
      userid: req.body.userid.toString(),
    });

    const room = await Room.findById(req.body.roomid);

    room.currentbookings.push({
      bookingid: booking._id.toString(),
      fromdate: req.body.fromdate,
      todate: req.body.todate,
    });

    await room.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* ================= GET BOOKINGS ================= */
router.post("/getbookingbyuserid", async (req, res) => {
  try {
    const bookings = await Booking.find({ userid: req.body.userid });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

/* ================= HARD DELETE BOOKING ================= */
router.post("/cancelbooking", async (req, res) => {
  try {
    const { bookingid, roomid } = req.body;

    console.log("🔥 HARD DELETE:", bookingid);

    // 1. DELETE booking
    await Booking.findByIdAndDelete(bookingid);

    // 2. REMOVE booking from room
    const room = await Room.findById(roomid);
    if (room) {
      room.currentbookings = room.currentbookings.filter(
        (b) => b.bookingid !== bookingid
      );
      await room.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cancel failed" });
  }
});

module.exports = router;
