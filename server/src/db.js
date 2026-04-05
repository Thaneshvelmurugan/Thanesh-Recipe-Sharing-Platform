import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDb = async () => {
  await mongoose.connect(config.mongoUri);
  console.log("MongoDB connected");
};
