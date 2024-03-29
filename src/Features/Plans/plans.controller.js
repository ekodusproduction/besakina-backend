import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
import { insertQuery } from "../../Utility/sqlQuery.js";

export const addPlan = async function (req, res, next) {
    let connection;
    try {
        connection = await pool.getConnection();
        const requestBody = req.body;
        const membership_badge = req.files[0].path;
        const [query, values] = await insertQuery('plans', { ...requestBody, membership_badge });

        await connection.beginTransaction();
        const [rows, field] = await connection.query(query, values);

        if (rows.affectedRows === 0) {
            await connection.rollback();
            return sendError(res, "Error adding plan", 400);
        }

        await connection.commit();
        return sendResponse(res, "Plan added successfully", 201, { id: rows.insertId }, null);
    } catch (error) {
        if (connection) await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

export const getPlan = async function (req, res, next) {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = `SELECT * FROM plans`;
        const [rows, field] = await connection.query(query);
        if (rows.length === 0) {
            return sendError(res, "No plan found", 404);
        }

        return sendResponse(res, "Plan List", 200, { plans: rows });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

export const deletePlan = async function (req, res, next) {
    let connection;
    try {
        connection = await pool.getConnection();
        const id = req.params.id;
        const query = `DELETE FROM plans WHERE id = ?`;
        const values = [id];

        await connection.beginTransaction();
        const [rows, field] = await connection.query(query, values);

        if (rows.affectedRows === 0) {
            return sendError(res, "No plan found", 404);
        }

        await connection.commit();
        return sendResponse(res, "Plan deleted successfully", 200, { id });
    } catch (error) {
        if (connection) await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

const plans = {
    addPlan,
    deletePlan,
    getPlan
};

export default plans;
