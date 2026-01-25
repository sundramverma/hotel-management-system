const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

/**
 * 🔍 CHECK ROOM AVAILABILITY
 * Used by frontend Room card
 */
router.post("/checkavailability", async (req, res) => {
  try {
    const { roomid, fromdate, todate } = req.body;

    if (!roomid || !fromdate || !todate) {
      return res.json({ available: false });
    }

    const from = moment(fromdate, "DD-MM-YYYY", true);
    const to = moment(todate, "DD-MM-YYYY", true);

    if (!from.isValid() || !to.isValid()) {
      return res.json({ available: false });
    }

    const bookings = await Booking.find({
      roomid,
      status: "booked",
    });

    for (const booking of bookings) {
      const bookedFrom = moment(booking.fromdate, "DD-MM-YYYY");
      const bookedTo = moment(booking.todate, "DD-MM-YYYY");

      // ❌ overlap
      if (
        from.isSameOrBefore(bookedTo) &&
        to.isSameOrAfter(bookedFrom)
      ) {
        return res.json({ available: false });
      }
    }

    return res.json({ available: true });
  } catch (error) {
    return res.json({ available: false });
  }
});

/**
 * 🔐 BOOK ROOM (REAL AVAILABILITY CHECK)
 */
router.post("/bookroom", async (req, res) => {
  try {
    const {
      room,
      roomid,
      userid,
      fromdate,
      todate,
      totalamount,
      totalDays,
      token,
    } = req.body;

    if (
      !room ||
      !roomid ||
      !userid ||
      !fromdate ||
      !todate ||
      !totalamount ||
      !totalDays ||
      !token
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const from = moment(fromdate, "DD-MM-YYYY", true);
    const to = moment(todate, "DD-MM-YYYY", true);

    if (!from.isValid() || !to.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // 🔥 REAL AVAILABILITY CHECK (Booking collection)
    const existingBookings = await Booking.find({
      roomid,
      status: "booked",
    });

    for (const booking of existingBookings) {
      const bookedFrom = moment(booking.fromdate, "DD-MM-YYYY");
      const bookedTo = moment(booking.todate, "DD-MM-YYYY");

      if (
        from.isSameOrBefore(bookedTo) &&
        to.isSameOrAfter(bookedFrom)
      ) {
        return res.status(400).json({
          success: false,
          message: "Room already booked for selected dates",
        });
      }
    }

    // 💳 STRIPE CUSTOMER
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // 💳 STRIPE PAYMENT
    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        currency: "INR",
        customer: customer.id,
        receipt_email: token.email,
        description: `Room booking - ${room}`,
      },
      { idempotencyKey: uuidv4() }
    );

    if (payment.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }

    // 💾 SAVE BOOKING
    const booking = new Booking({
      room,
      roomid,
      userid,
      fromdate: from.format("DD-MM-YYYY"),
      todate: to.format("DD-MM-YYYY"),
      totalamount,
      totaldays: totalDays,
      transactionId: payment.id,
      status: "booked",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Room booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

/**
 * 📄 GET BOOKINGS BY USER
 */
router.post("/getbookingbyuserid", async (req, res) => {
  try {
    const bookings = await Booking.find({
      userid: req.body.userid,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

/**
 * ❌ CANCEL BOOKING
 */
router.post("/cancelbooking", async (req, res) => {
  try {
    const { bookingid } = req.body;

    const booking = await Booking.findById(bookingid);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch {
    res.status(500).json({ message: "Cancel failed" });
  }
});

module.exports = router;
