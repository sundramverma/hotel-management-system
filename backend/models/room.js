const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    maxcount: { type: Number, required: true },
    phonenumber: { type: Number, required: true },
    rentperday: { type: Number, required: true },

    // 🔥 MATCHING YOUR DB
    imageurls: {
      type: [String],
      required: true,
    },

    type: { type: String, required: true },
    description: { type: String, required: true },

    facilities: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },

    currentbookings: { type: Array, default: [] },
  },
  { timestamps: true }
);

// 🔒 FORCE correct collection
module.exports = mongoose.model("Room", roomSchema, "rooms");
