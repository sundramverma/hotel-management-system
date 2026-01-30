    const mongoose = require("mongoose");

    const connectDB = async () => {
      try {
        console.log("🔄 Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
          dbName: "hotel-management", // 🔥 THIS FIXES EVERYTHING
          autoIndex: false,
          serverSelectionTimeoutMS: 10000,
        });

        console.log("✅ MongoDB Atlas Connected Successfully!");
        console.log("📁 Database:", mongoose.connection.name);
        console.log("🏠 Host:", mongoose.connection.host);
      } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);
        process.exit(1);
      }
    };

    module.exports = connectDB;
