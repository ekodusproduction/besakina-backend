// import { sendError } from "../Utility/response.js";


// // SQL query template with placeholders
// const countAdds = `
//     SELECT
//         SUM(advertisement_count) AS total_advertisements
//     FROM (
//         SELECT COUNT(*) AS advertisement_count FROM property WHERE user = ?
//         UNION ALL
//         SELECT COUNT(*) AS advertisement_count FROM vehicles WHERE user = ?
//         UNION ALL
//         SELECT COUNT(*) AS advertisement_count FROM education WHERE user = ?
//         UNION ALL
//         SELECT COUNT(*) AS advertisement_count FROM hospitals WHERE user = ?
//         UNION ALL
//         SELECT COUNT(*) AS advertisement_count FROM doctors WHERE user = ?
//         UNION ALL
//         SELECT COUNT(*) AS advertisement_count FROM hospitality WHERE user = ?
//     ) AS advertisement_counts;
// `;

// export const checkPlanValidity = async function (req, res, next) {
//     try {

//         // Fetch user information
//         const [users, userFields] = await connection.query.raw('SELECT * FROM users WHERE id = ?', [req.user]);
//         const user = users[0]; // Assuming user is unique by ID

//         if (!user) {
//             return await sendError(res, 'User not found', 404);
//         }

//         const plan_id = user.plan_id;
//         if (plan_id == null) {
//             return await sendError(res, 'Invalid plan', 400);
//         }

//         const [plans, planFields] = await connection.query.raw('SELECT * FROM plans WHERE id = ?', [plan_id]);
//         const plan = plans[0];

//         if (!plan) {
//             return await sendError(res, 'Plan not found', 404);
//         }

//         const millisecondsInDay = 24 * 60 * 60 * 1000;
//         const planValidity = plan.validity * millisecondsInDay;
//         const userPlanSubscriptionDate = new Date(user.plan_date);

//         if (userPlanSubscriptionDate.getTime() + planValidity < Date.now()) {
//             return await sendError(res, 'Invalid plan. Plan Expired', 400);
//         }

//         const dynamicQuery = countAdds.replaceAll('?', user);

//         const [count, postFields] = await connection.query.raw(dynamicQuery);

//         next();
//     } catch (error) {
//         next(error);
//     }
// };
