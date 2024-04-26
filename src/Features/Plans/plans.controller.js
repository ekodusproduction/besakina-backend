import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";

export const addPlan = async function (req, res, next) {
    let connection = await pool.getConnection();

    try {
        const requestBody = req.body;
        const membership_badge = req.files[0].path;
        const [plan] = await pool('plans').insert({ ...requestBody, membership_badge });

        return sendResponse(res, "Plan added successfully", 201, { id: plan }, null);
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
}

export const getPlan = async function (req, res, next) {
    let connection = await pool.getConnection();

    try {
        const plans = await pool('plans').select('*');
        if (plans.length === 0) {
            return sendError(res, "No plan found", 404);
        }

        return sendResponse(res, "Plan List", 200, { plans });
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
}

export const deletePlan = async function (req, res, next) {
    let connection = await pool.getConnection();

    try {
        const id = req.params.id;
        const deletedCount = await pool('plans').where('id', id).del();

        if (deletedCount === 0) {
            return sendError(res, "No plan found", 404);
        }

        return sendResponse(res, "Plan deleted successfully", 200, { id });
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
};

const plans = {
    addPlan,
    deletePlan,
    getPlan
};

export default plans;
