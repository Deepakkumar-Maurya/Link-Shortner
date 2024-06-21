import express from "express";
import { generateShortUrl, getUrls, deleteUrl } from "../controllers/url.controller.js";
import isAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/short_url", isAuth, generateShortUrl);
router.get("/getUrls", isAuth, getUrls);
router.delete("/deleteUrl", isAuth, deleteUrl);

export default router;
