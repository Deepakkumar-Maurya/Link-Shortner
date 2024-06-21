import express from "express";
import { generateQRCode, deleteQRCode } from "../controllers/qrcode.controller.js";
import isAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/generateQRCode', isAuth, generateQRCode);
router.delete('/deleteQRCode', isAuth, deleteQRCode);

export default router;