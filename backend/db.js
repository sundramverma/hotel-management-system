const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGO_URI;

if (!mongoURL) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1);
}

console.log("🔄 Connecting to MongoDB...");

mongoose
  .connect(mongoURL)   // ✅ NO options here
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📁 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
    process.exit(1);
  });

module.exports = mongoose;
