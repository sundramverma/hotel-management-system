const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: String,
    roomid: String,

    // 🔥 IMPORTANT: STRING ONLY
    userid: String,

    fromdate: String,
    todate: String,
    totalamount: Number,
    totaldays: Number,
    transactionId: String,
    status: {
      type: String,
      default: "booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookings", bookingSchema);
