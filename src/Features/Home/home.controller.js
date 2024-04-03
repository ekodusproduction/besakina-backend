import pool from "../../Mysql/mysql.database.js"
import { selectLatestAds } from "./sqlQueries.js"
export const latestAdds = async function (req, res, next) {
    const connection = await pool.getConnection()
    try {
        const [rows, fields] = await connection.query(selectLatestAds)
        return sendResponse(res, "Latest Adds", 200, { advertisements: rows });
    } catch (error) {
        next(error)
    } finally {
        connection.release()
    }
}