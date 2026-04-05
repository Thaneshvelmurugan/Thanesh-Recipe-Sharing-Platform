import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(`Connection target: ${config.mongoUri}`);
    console.error(
      "Set MONGO_URI in your environment to a valid MongoDB Atlas or hosted MongoDB connection string."
    );
    console.error(error);
    throw error;
  }
};
