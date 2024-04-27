import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
import { deleteQuery, insertQuery, selectQuery } from "../../Utility/sqlQuery.js";

export const addPlan = async function (req, res, next) {
    let connection = await pool.getConnection();

    try {
        const requestBody = req.body;
        const membership_badge = req.files[0].path;

        const [query, values] = await insertQuery('plans', { ...requestBody, membership_badge: membership_badge })
      
        const [rows, fields] = await connection.query(query, values);

        return sendResponse(res, "Plan added successfully", 201, { id: rows.insertId }, null);
    } catch (error) {
        next(error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}

export const getPlan = async function (req, res, next) {
    let connection = await pool.getConnection();
    try {
        const [query, values] = await selectQuery("plans", {}, {})
        const [rows, fields] = await connection.query(query);
        if (rows.length === 0) {
            return sendError(res, "No plan found", 404);
        }

        return sendResponse(res, "Plan List", 200, rows);
    } catch (error) {
        next(error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}

export const deletePlan = async function (req, res, next) {
    let connection = await pool.getConnection();

    try {
        const id = req.params.id;
        const sql = `DELETE FROM plans WHERE id = ?`
        const deletedCount = await connection.query(sql, id);

        if (deletedCount === 0) {
            return sendError(res, "No plan found", 404);
        }

        return sendResponse(res, "Plan deleted successfully", 200, { id });
    } catch (error) {
        next(error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
};

const plans = {
    addPlan,
    deletePlan,
    getPlan
};

export default plans;
