import express from "express";
import { signup, signin, logout } from "../controllers/auth.controller.js";
import isAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", isAuth, logout);


export default router;
