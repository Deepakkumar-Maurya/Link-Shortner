import express from "express";
import auth from "./auth.js";
import url from "./url.js";
import qrcode from "./qrcode.js"
import { redirectToLongUrl } from "../controllers/url.controller.js";

const router = express.Router();

// ** routes
router.use("/auth", auth);
router.use("/url", url);
router.use("/qr", qrcode);
router.get("/:shortUrl", redirectToLongUrl);

// ** root route
router.get("/", (req, res) => {
  res.json({
    title: "URL Shortner API",
    description: "A simple URL shortner API",
    routes: {
      "POST /auth/signup": "User registration",
      "POST /auth/signin": "User login",
      "GET /auth/logout": "User logout",
      "GET /:shortUrl": "Redirect to original URL",
      "POST /url/short_url": "Create a shortened URL",
      "GET /url/getUrls": "Get all shortened URLs",
      "DELETE /url/deleteUrl": "Delete a shortened URL",
    },
  });
});

export default router;
