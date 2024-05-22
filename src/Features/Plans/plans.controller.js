import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
import { deleteQuery, insertQuery, selectQuery } from "../../Utility/sqlQuery.js";
import Plan from "./Models/PlanModel.js";

export const addPlan = async function (req, res, next) {
    try {
        const requestBody = req.body;
        const membership_badge = req.fileUrls[0].path;
        console.log("mem", { ...requestBody, membership_badge })
        const plan = new Plan({ ...requestBody, membership_badge });
        const savedPlan = await plan.save();

        return sendResponse(res, "Plan added successfully", 201, { id: savedPlan._id }, null);
    } catch (error) {
        throw ApplicationError(error, 400);
    }
};

export const getPlan = async function (req, res, next) {
    try {
        const plans = await Plan.find({});
        if (plans.length === 0) {
            return sendError(res, "No plan found", 404);
        }

        return sendResponse(res, "Plan List", 200, plans);
    } catch (error) {
        next(error);
    }
};

export const deletePlan = async function (req, res, next) {
    try {
        const id = req.params.id;
        const deletedPlan = await Plan.findByIdAndDelete(id);

        if (!deletedPlan) {
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
