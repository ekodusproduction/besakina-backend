import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
import { insertQuery } from "../../Utility/sqlQuery.js";

export const createCategory = async (req, res, next) => {
    let requestBody = req.body;
    requestBody.photos = req.files
    const connection = await pool.getConnection();
    try {
        const [query, values] = await insertQuery('category', requestBody);
        await connection.beginTransaction();
        const [rows, fields] = await connection.query(query, values);
        if (rows.affectedRows === 0) {
            await connection.rollback();
            return sendError(res, "Error adding advertisement", 400);
        }
        await connection.commit();
        return sendResponse(res, "Advertisement added successfully", 201, { result: rows.insertId });
    } catch (error) {
        await deleteFiles(req.files)
        await connection.rollback()
        next(error)
    } finally {
        connection.release();
    }
}
export const listCategory = async (req, res, next) => {
    let connection = await pool.getConnection();;
    try {
        const [query, values] = await selectQuery('category', [], { is_active: 1 });
        const [rows, fields] = await connection.query(query, values);
        if (rows.length === 0) {
            return sendError(res, "Advertisements not found", 404);
        }

        return sendResponse(res, "Advertisements fetched successfully", 200, { categories: rows });
    } catch (error) {
        return sendError(res, error.message || "Error fetching advertisements", 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
