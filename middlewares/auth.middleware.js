import User from "../models/User.js";
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader == null || authHeader === "") {
            throw new Error("No token provided");
        }
        const token = authHeader?.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const userFromDB = await User.findById(user.id);
        if (!userFromDB) {
            throw new Error("User not found");
        }
        if (userFromDB.token !== token) {
            throw new Error("Invalid token");
        }
        req.userId = user.id;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: "Error in authentication",
            error: error.message,
        });
    }
}

export default isAuth;
