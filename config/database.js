import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default function connect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const url = process.env.MONGO_URL;
    if (!url) {
      console.log("Missing Connection String for MongoDB");
      throw new Error("Connection String not found");
    } else {
      console.log("DB Online");
      return mongoose.connect(url);
    }
  }
}
