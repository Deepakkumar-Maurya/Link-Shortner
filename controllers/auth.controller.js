import User from "../models/User.js";
import {
    matchPassword,
    generateAuthToken,
    compareTokenAndUser,
} from "../helpers/auth.helper.js";
import { sendForgetPwdMail } from "../helpers/email.helper.js";

const signup = async (req, res) => {
    try {
        // ** input validations
        if (!req.body.username || !req.body.email || !req.body.password) {
            const error = new Error("Please fill all the fields");
            error.statusCode = 400;
            throw error;
        }
        if (req.body.password.length < 4) {
            const error = new Error("Password must be at least 4 characters");
            error.statusCode = 400;
            throw error;
        }
        if (
            req.body.email.indexOf("@") === -1 ||
            req.body.email.indexOf(".") === -1 ||
            req.body.email.indexOf("@") > req.body.email.lastIndexOf(".")
        ) {
            const error = new Error("Please enter a valid email");
            error.statusCode = 400;
            throw error;
        }

        if (req.body.username.length < 3) {
            const error = new Error("Username must be at least 3 characters");
            error.statusCode = 400;
            throw error;
        }

        const { username, email, password } = req.body;

        // ** check if user already exists
        const user = await User.findOne({ email: email });
        if (user) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        // ** create a new user
        const newUser = new User({
            username: username,
            email: email,
            password: password,
        });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        // console.log(error.message);
        const statusCode = error.statusCode || 500;
        // console.log("1111",error.stack.split("\n")[1]);
        return res.status(statusCode).json({
            success: false,
            message: "Error creating new user",
            error: error.message,
        });
    }
};

const signin = async (req, res) => {
    try {
        // ** input validations
        if (!req.body.email || !req.body.password) {
            const error = new Error("Please fill all the fields");
            error.statusCode = 400;
            throw error;
        }
        if (req.body.email.indexOf("@") === -1) {
            const error = new Error("Please enter a valid email");
            error.statusCode = 400;
            throw error;
        }

        const { email, password } = req.body;

        // ** check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("No such user found");
            error.statusCode = 404;
            throw error;
        }

        // ** match password
        const isMatch = matchPassword(user, password);
        if (!isMatch) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const isForgetPwd = false;

        // ** generate a token
        const token = await generateAuthToken(user, isForgetPwd);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 days
        });
        return res.status(200).json({
            success: true,
            message: "User signed in successfully",
            token: token,
        });
    } catch (error) {
        console.log(error.message);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: "Error while signing user",
            error: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        // ** clear the token
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "User signed out successfully",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error while signing user out",
            error: error.message,
        });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error(`No such user found with this email ${email}`);
        }

        const isForgetPwd = true;

        // ** generate a token
        const resetToken = await generateAuthToken(user, isForgetPwd);

        // ** save the token in db
        await User.updateOne({ _id: user.id }, { token: resetToken });

        const resetURL = `${req.protocol}://${req.get(
            "host"
        )}/auth/resetpassword/${resetToken}`;

        const isMailSent = await sendForgetPwdMail(email, resetURL);
        if (!isMailSent.success) {
            throw new Error(`Error while sending mail to ${email}`);
        }

        return res.status(200).json({
            success: true,
            message:
                "A link has been sent to your email having validity of 2 minutes. Please click on the link to reset your password",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error while forgetting password",
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.resetToken;
        const { newPassword } = req.body;

        const isMatch = await compareTokenAndUser(resetToken);
        if (!isMatch.success) {
            throw new Error(isMatch.error);
        }

        const user = isMatch.user;
        user.password = newPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error while resetting password",
            error: error.message,
        });
    }
};

export { signup, signin, logout, forgetPassword, resetPassword };
