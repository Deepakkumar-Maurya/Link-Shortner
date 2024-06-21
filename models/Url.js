import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    unique: true,
  },
  qrcode: {
    type: String,
  },
  visitHistory: [{ timestamp: { type: Date } }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const URL = mongoose.model("URL", urlSchema);

export default URL;
