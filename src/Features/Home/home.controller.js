import pool from "../../Mysql/mysql.database.js"
import { sendResponse } from "../../Utility/response.js"
import { selectLatestAds } from "./sqlQueries.js"
export const latestAdds = async function (req, res, next) {
    const connection = await pool.getConnection()
    try {
        const [rows, fields] = await connection.query(selectLatestAds)
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