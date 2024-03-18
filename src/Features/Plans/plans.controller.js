import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
export const addPlan = async function (req, res, next) {
    try {
        const connection = await pool.getConnection();

        const requestBody = req.body;

        const columns = "description, price, validity";
        const values = [requestBody.description, requestBody.price, requestBody.validity];
        const query = `INSERT INTO advertise (${columns}) VALUES (?, ?, ?)`;

        await connection.beginTransaction();
        const [rows, field] = await connection.query(query, values);

        if (rows.affectedRows > 0) {
            await connection.commit();
            connection.release();
            return await sendError(res, "Error adding plan", null, 400, null);
        }

        return await sendResponse(res, "Plan added successfully", { id: rows.insertId }, 201, null);

    } catch (error) {
        await connection.rollback();
        connection.release();

        return await sendError(res, error, null, 400, null);
    }
}

export const getPlan = async function (req, res, next) {
    try {
        const connection = await pool.getConnection();

        const query = `SELECT * FROM plans`;
        const [rows, field] = await connection.query(query);

        await connection.commit();
        connection.release();

        if (rows.affectedRows > 0) {
            return await sendError(res, "Error fetching plans", null, 400, null);
        }

        return await sendResponse(res, "Plan List", { plans: rows }, 201, null);

    } catch (error) {
        await connection.rollback();
        connection.release();

        return await sendError(res, error, null, 400, null);
    }
}

export const deletePlan = async function (req, res, next) {
    try {
        const connection = await pool.getConnection();

        const id = req.params.id;

        const query = `DELETE FROM plans WHERE id = ?`;
        const values = [id];

        await connection.beginTransaction();
        const [rows, field] = await connection.query(query, values);

        if (rows.affectedRows > 0) {
            await connection.commit();
            connection.release();
            return await sendError(res, "Error deleting plan", null, 400, null);
        }

        return await sendResponse(res, "Plan deleted successfully", { id: requestBody.id }, 201, null);

    } catch (error) {
        await connection.rollback();
        connection.release();

        return await sendError(res, error, null, 400, null);
    }
}

const plans = {
    addPlan,
    deletePlan,
    getPlan
};

export default plans;
