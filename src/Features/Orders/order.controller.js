import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";

export const subscribe = async function (req, res, next) {
    const connection = await pool.getConnection()
    try {

    } catch (error) {

    } finally {
        connection.release();
    }
}