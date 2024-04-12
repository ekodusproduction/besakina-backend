import pool from "../../Mysql/mysql.database.js"
import { sendResponse } from "../../Utility/response.js"
import { selectLatestAds, searchAdd } from "./sqlQueries.js"


export const latestAdds = async function (req, res, next) {
    const connection = await pool.getConnection()
    try {
        const limit = req.query?.limit || 100;
        const page = req.query?.page || 1;
        const pageNumber = parseInt(page) || 1;
        const offset = (pageNumber - 1) * limit;

        const [rows, fields] = await connection.query(selectLatestAds, [limit, offset])
        console.log(rows)
        rows.forEach(advertisement => {
            advertisement.images = JSON.parse(advertisement.images);
            advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
        });
        return sendResponse(res, "Latest Adds", 200, { advertisements: rows });
    } catch (error) {
        next(error)
    } finally {
        connection.release()
    }
}

export const searchAdds = async function (req, res, next) {
    const connection = await pool.getConnection();
    try {
        const limit = req.query?.limit || 100;
        const page = req.query?.page || 1;
        const search = req.query?.search || '';
        const pageNumber = parseInt(page) || 1;
        const offset = (pageNumber - 1) * limit;

        const query = `
            ${searchAdd}
            LIMIT ${limit};
        `;
        console.log("query ", query)
        const [rows, fields] = await connection.execute(query, [search, search, search, search, search, search]);
        console.log(rows);
        rows.forEach(advertisement => {
            advertisement.images = JSON.parse(advertisement.images);
            advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
        });
        return sendResponse(res, "Latest Adds", 200, { advertisements: rows });
    } catch (error) {
        console.log(error)
        next(error);
    } finally {
        connection.release();
    }
}
