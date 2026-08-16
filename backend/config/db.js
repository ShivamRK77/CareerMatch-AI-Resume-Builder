const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careermatch';
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.log("⚠️ MongoDB Error: Could not connect to database. Server will continue running without DB support.");
        console.log("   Details:", err.message);
        // Removed process.exit(1) so the backend doesn't crash entirely!
    }
};

module.exports = connectDB;
