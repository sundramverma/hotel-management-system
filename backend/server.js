const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const app = express();

app.use(express.json());
app.use(cors());

// 🔥 test
app.get("/test", (req, res) => {
  res.send("SERVER OK");
});

// 🔥 routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/rooms", require("./routes/roomRoute"));
app.use("/api/bookings", require("./routes/bookingRoute"));

connectDB();


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
