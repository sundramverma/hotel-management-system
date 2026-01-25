const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// DB connection
require("./db");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
const roomRoutes = require("./routes/roomRoute");
const bookingRoutes = require("./routes/bookingRoute");
const userRoutes = require("./routes/userRoute");

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.send("🚀 Hotel Management API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log("=================================");
});
