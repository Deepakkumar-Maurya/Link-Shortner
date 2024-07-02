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

const generateAuthToken = async (user, isForgetPwd) => {
  console.log("generateAuthToken", user.id);
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  console.log(payload);

  let expTime = 0;
  if (isForgetPwd) {
    expTime = "2m";
  } else {
    expTime = "30m";
  }

  // ** create a token with the payload and secret
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expTime,
  });
  console.log(token);

  // ** save the token in db
  await User.updateOne({ _id: user.id }, { token });
  return token;
}

const compareTokenAndUser = async (resetToken) => {
  try {
    const userFromToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!userFromToken) {
      throw new Error("Invalid token");
    }

    const userFromDB = await User.findOne({ token: resetToken });
    if (!userFromDB) {
      throw new Error("Invalid token");
    }

    if (userFromDB.email !== userFromToken.email) {
      throw new Error("Invalid token");
    }

    return {
      success: true,
      message: "Token and user match",
      user: userFromDB,
    }
  } catch (error) {
    return {
      success: false,
      message: "Error while comparing token and user",
      error: error.message,
    }
  }
}

export { addSalt, matchPassword, generateAuthToken, compareTokenAndUser };
