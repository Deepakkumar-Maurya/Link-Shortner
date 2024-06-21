import mongoose from "mongoose";
import { addSalt } from "../helpers/auth.helper.js";

// ** user schema 
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  token: {
    type: String,
  }
});

// ** add salt before saving
userSchema.pre("save", addSalt);

const User = mongoose.model("User", userSchema);

export default User;
