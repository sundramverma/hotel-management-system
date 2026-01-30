const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

/* 🔥 TEST ROUTE */
app.get("/test", (req, res) => {
  res.send("SERVER OK");
});

/* 🔥 ROUTES */
app.use("/api/rooms", require("./routes/roomRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/bookings", require("./routes/bookingRoute")); // ✅ MUST

connectDB();

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
