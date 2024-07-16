import Url from "../models/Url.js";
import { nanoid } from "nanoid";
import { isUniqueUrl } from "../helpers/url.helper.js";

const generateShortUrl = async (req, res) => {
    const long_url = req.body.longUrl;
    const user_id = req.userId;
    try {
        // ** generate short url
        let short_url = "";

        // ** check if short url is unique
        let isUrlUnique = false;
        while (!isUrlUnique) {
            short_url = nanoid(5);
            isUrlUnique = await isUniqueUrl(short_url);
        }

        // ** save the url
        const savedUrl = new Url({
            original_url: long_url,
            short_url: short_url,
            user: user_id,
        });
        await savedUrl.save();

        return res.status(200).json({
            success: true,
            message: "Url shortened successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error shortening url",
            error: error.message,
        });
    }
};

const redirectToLongUrl = async (req, res) => {
    const short_url = req.params.shortUrl;
    try {
        // ** find the url
        const url = await Url.findOne({ short_url: short_url });
        if (!url) {
            const error = new Error("No such url found");
            error.statusCode = 404;
            throw error;
        }
        // ** update the visit history
        url.visitHistory.push({ timestamp: new Date() });
        await url.save();

        // ** redirect to long url
        res.redirect(url.original_url);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: "Error redirecting to long url",
            error: error.message,
        });
    }
};

const getUrls = async (req, res) => {
    const user_id = req.userId;
    try {
        // ** get urls
        const urls = await Url.find({ user: user_id });
        if (!urls) {
            const error = new Error("No urls found");
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Urls retrieved successfully",
            urls: urls,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: "Error retrieving urls",
            error: error.message,
        });
    }
};

const deleteUrl = async (req, res) => {
    const short_url = req.body.shortUrl;
    const user = req.userId;
    try {
        // ** delete url
        const url = await Url.findOneAndDelete({
            short_url: short_url,
            user: user,
        });
        if (!url) {
            const error = new Error("No such url found");
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Url deleted successfully",
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: "Error deleting url",
            error: error.message,
        });
    }
};

export { generateShortUrl, redirectToLongUrl, getUrls, deleteUrl };
