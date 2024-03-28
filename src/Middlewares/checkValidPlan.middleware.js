import { sendError } from "../Utility/response.js";
import pool from "../Mysql/mysql.database.js";

// SQL query template with placeholders
const countAdds = `
    SELECT 
        SUM(advertisement_count) AS total_advertisements
    FROM (
        SELECT COUNT(*) AS advertisement_count FROM property WHERE user_id = ? 
        UNION ALL
        SELECT COUNT(*) AS advertisement_count FROM vehicles WHERE user_id = ? 
        UNION ALL
        SELECT COUNT(*) AS advertisement_count FROM education WHERE user_id = ? 
        UNION ALL
        SELECT COUNT(*) AS advertisement_count FROM hospitals WHERE user_id = ? 
        UNION ALL
        SELECT COUNT(*) AS advertisement_count FROM doctors WHERE user_id = ? 
        UNION ALL
        SELECT COUNT(*) AS advertisement_count FROM hospitality WHERE user_id = ? 
    ) AS advertisement_counts;
`;

export const checkPlanValidity = async function (req, res, next) {
    const connection = await pool.getConnection();
    try {
        const user_id = req.user_id;

        // Fetch user information
        const [users, userFields] = await connection.query('SELECT * FROM users WHERE id = ?', [user_id]);
        const user = users[0]; // Assuming user is unique by ID

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        const plan_id = user.plan_id;
        if (plan_id == null) {
            return sendError(res, 'Invalid plan', 400);
        }

        // Fetch plan information
        const [plans, planFields] = await connection.query('SELECT * FROM plans WHERE id = ?', [plan_id]);
        const plan = plans[0]; // Assuming plan is unique by ID

        if (!plan) {
            return sendError(res, 'Plan not found', 404);
        }

        const millisecondsInDay = 24 * 60 * 60 * 1000;
        const planValidity = plan.validity * millisecondsInDay;
        const userPlanSubscriptionDate = new Date(user.plan_date);

        if (userPlanSubscriptionDate.getTime() + planValidity < Date.now()) {
            return sendError(res, 'Invalid plan. Plan Expired', 400);
        }

        // Replace placeholders with user_id in the SQL query
        const dynamicQuery = countAdds.replaceAll('?', user_id);

        const [count, postFields] = await connection.query(dynamicQuery);
        
        next();
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
};
