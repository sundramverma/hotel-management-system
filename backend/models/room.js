const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
    },

    maxcount: {
      type: Number,
      required: true,
      min: 1,
    },

    phonenumber: {
      type: Number,
      required: true,
    },

    rentperday: {
      type: Number,
      required: true,
      min: 0,
    },

    imageurls: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one image URL is required",
      },
    },

    currentbookings: {
      type: [
        {
          bookingid: { type: String },
          fromdate: { type: String },
          todate: { type: String },
          userid: { type: String },
          status: { type: String },
        },
      ],
      default: [],
    },

    type: {
      type: String,
      required: true,
      enum: ["Deluxe", "Suite", "Standard", "Economy", "Premium"],
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
    },

    facilities: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rooms", roomSchema);
