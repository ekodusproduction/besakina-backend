import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";

export const addPlan = async function (req, res, next) {
    try {
        const requestBody = req.body;
        const membership_badge = req.files[0].path;
        const [plan] = await pool('plans').insert({ ...requestBody, membership_badge });
        
        return sendResponse(res, "Plan added successfully", 201, { id: plan }, null);
    } catch (error) {
        next(error);
    }
}

export const getPlan = async function (req, res, next) {
    try {
        const plans = await pool('plans').select('*');
        if (plans.length === 0) {
            return sendError(res, "No plan found", 404);
        }

        return sendResponse(res, "Plan List", 200, { plans });
    } catch (error) {
        next(error);
    }
}

export const deletePlan = async function (req, res, next) {
    try {
        const id = req.params.id;
        const deletedCount = await pool('plans').where('id', id).del();

        if (deletedCount === 0) {
            return sendError(res, "No plan found", 404);
        }

        return sendResponse(res, "Plan deleted successfully", 200, { id });
    } catch (error) {
        next(error);
    }
};

const plans = {
    addPlan,
    deletePlan,
    getPlan
};

export default plans;
