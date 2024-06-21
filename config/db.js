import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  const dburl = process.env.MONGO_URI;
  try {
    await mongoose.connect(dburl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message);
    throw new Error("Error connecting to database");
  }
};

export default connectDB;