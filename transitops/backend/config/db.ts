import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn("⚠️ MONGO_URI is missing in environment variables. Database will run in disconnected mode.");
      console.warn("👉 Please add MONGO_URI in the AI Studio Settings (Secrets) to connect to MongoDB Atlas.");
      return;
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected successfully to Atlas.");
  } catch (error) {
    console.error("⚠️ MongoDB connection warning: Could not connect to Atlas.");
    console.error("👉 Please ensure your IP is whitelisted in MongoDB Atlas or your MONGO_URI is correct.");
  }
};
