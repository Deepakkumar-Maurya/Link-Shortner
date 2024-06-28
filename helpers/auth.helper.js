import { createHmac, randomBytes } from "crypto";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function addSalt(user, next) {

  // ** check if password is modified
  if (!user.isModified("password")) return;

  // ** generate a random salt
  const salt = randomBytes(16).toString();

  // ** hash the password with the salt
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  // ** add the salt and hashedPassword to the user object
  user.salt = salt;
  user.password = hashedPassword;

  next();
}

const matchPassword = (user, password) => {
  const salt = user.salt;
  const hashedPassword = user.password;

  // ** hash the password with the salt
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    // ** hash comparison
  if (userProvidedHash !== hashedPassword) {
    return false;
  }
  return true;
};

const generateAuthToken = async (user) => {
  console.log("generateAuthToken", user.id);
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  console.log(payload);

  // ** create a token with the payload and secret
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
  console.log(token);

  // ** save the token in db
  await User.updateOne({ _id: user.id }, { token });
  return token;
}

export { addSalt, matchPassword, generateAuthToken };
