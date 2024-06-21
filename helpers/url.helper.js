import Url from "../models/Url.js";

const isUniqueUrl = async (short_url) => {
    try {
        const url = await Url.findOne({ short_url: short_url });
        if (url) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export { isUniqueUrl };