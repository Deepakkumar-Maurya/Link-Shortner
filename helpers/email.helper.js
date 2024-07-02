import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendForgetPwdMail = async (email, resetURL) => {
    try {
        // ** create a transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, // You can also use 587
            secure: true, // Use true for 465, false for 587
            auth: {
                user: process.env.SERVICE_EMAIL,
                pass: process.env.MAIL_SECRET_KEY,
            },
        });

        // ** mail content
        const mailContent = (resetURL) => {
            return `
            <h1>Reset your password</h1>
            <p>Click on the link below to reset your password</p>
            <a href="${resetURL}">${resetURL}</a>
            <p>This link will expire in 2 minutes</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            `;
        };

        // ** email options
        const emailOptions = {
            from: "linker support<linker@gmail.com>",
            to: email,
            subject: "Reset password request",
            html: mailContent(resetURL),
        };

        // ** send email
        await transporter.sendMail(emailOptions);

        return {
            success: true,
            message: "Email sent successfully",
        }
    } catch (error) {
        return {
            success: false,
            message: "Error while sending email",
            error: error.message,
        };
    }
};

export { sendForgetPwdMail };
