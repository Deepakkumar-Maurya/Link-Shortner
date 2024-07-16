import Url from "../models/Url.js";
import QRCode from "qrcode";

const generateQRCode = async (req, res) => {
    const long_url = req.params.long_url;
    try {
        // ** find the url
        const url = await Url.findOne({ original_url: long_url });
        if (!url) {
            const error = new Error("No such url found");
            error.statusCode = 404;
            throw error;
        }

        // ** generate QRCode
        const qrcode = await QRCode.toDataURL(long_url);

        // ** update the QRCode
        url.qrcode = qrcode;
        await url.save();

        return res.status(200).json({
            success: true,
            message: "QRCode generated successfully",
            qrcode: qrcode,
        });
    } catch (error) {
        console.log(error.message);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: "Error generating QRCode",
            error: error.message,
        });
    }
};

const deleteQRCode = async (req, res) => {
    const long_url = req.params.long_url;
    const user = req.userId;
    try {
        // ** find the url
        const url = await Url.findOne({ original_url: long_url, user: user });
        if (!url) {
            const error = new Error("No such url found");
            error.statusCode = 404;
            throw error;
        }

        // ** delete the QRCode
        url.qrcode = "";
        await url.save();

        return res.status(200).json({
            success: true,
            message: "QRCode deleted successfully",
        });
    } catch (error) {
        console.log(error.message);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: "Error deleting QRCode",
            error: error.message,
        });
    }
};

export { generateQRCode, deleteQRCode };
