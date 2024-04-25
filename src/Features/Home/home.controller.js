import pool from "../../Mysql/mysql.database.js";
import { sendResponse } from "../../Utility/response.js";
import { selectLatestAds, searchAdd } from "./sqlQueries.js";

const parseImages = async (advertisements) => {
    return advertisements.map(advertisement => {
        advertisement.images = JSON.parse(advertisement.images);
        advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
        return advertisement;
    });
};

export const latestAdds = async function (req, res, next) {
    try {
        const limit = req.query?.limit || 100;
        const page = req.query?.page || 1;
        const pageNumber = parseInt(page) || 1;
        const offset = (pageNumber - 1) * limit;

        const rows = await pool.raw(selectLatestAds, [limit, offset]);
        const advertisements = await parseImages(rows[0]);

        return sendResponse(res, "Latest Adds", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};

export const searchAdds = async function (req, res, next) {
    try {
        const limit = req.query?.limit || 100;
        const page = req.query?.page || 1;
        let search = req.query?.search || '';
        const pageNumber = parseInt(page) || 1;
        const offset = (pageNumber - 1) * limit;
        search = `+${search}*`;

        const rows = await pool.raw(searchAdd, [search, search, search, search, search, search]);
        const advertisements = await parseImages(rows[0]);

        return sendResponse(res, "Search Results", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};
