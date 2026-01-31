const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    maxcount: { type: Number, required: true },
    phonenumber: { type: Number, required: true },
    rentperday: { type: Number, required: true },

    imageurls: {
      type: [String],
      required: true,
    },

    type: { type: String, required: true },
    description: { type: String, required: true },

    facilities: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },

    // 🔥 IMPORTANT FOR BOOKINGS CLEANUP
    currentbookings: [
      {
        bookingid: String,
        fromdate: String,
        todate: String,
      },
    ],
  },
  { timestamps: true }
);

// 🔒 FORCE correct collection name
module.exports = mongoose.model("Room", roomSchema, "rooms");
