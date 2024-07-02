import express from "express";
import { signup, signin, logout, forgetPassword, resetPassword } from "../controllers/auth.controller.js";
import isAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", isAuth, logout);
router.post("/forgetpassword", forgetPassword);
router.post("/resetpassword/:resetToken", resetPassword);


export default router;
