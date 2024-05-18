import { sendError } from "../../Utility/response.js"
import pool from "../../Mysql/mysql.database.js"
import { countUserPosts, fetchPlansAndTotalAdds } from "./sql.js"

export const checkUserProfileCompletion = async function (req, res, next) {
    const connection = await pool.getConnection()
    console.log("checking user profile")
    try {
        const selectUser = `SELECT fullname, email, mobile, city, state FROM users WHERE id = ?`
        const [rows, fields] = await connection.query(selectUser, [req.user_id])
        const userProfile = rows[0];
        if (!userProfile.fullname || !userProfile.email || !userProfile.mobile || !userProfile.city || !userProfile.state) {
            return await sendError(res, "User Profile Incomplete", 400);
        }
        next()
    } catch (error) {
        console.log("checking user profile error", error)
        return await sendError(res, "Internal Server Error", 500);
    } finally {
        connection.release()
    }
}

// export const checkUserPlanQuotaPermissions = async function (req, res, next) {
//     const connection = await pool.getConnection()
//     try {
//         const selectUser = `SELECT * FROM userselectedplans WHERE user_id = ?`
//         const [rows, fields] = await connection.query(selectUser, [req.user_id])
//         const userProfile = rows[0];
//         const planSql = `SELECT * FROM plans WHERE id = ?`
//         const [plans, planFields] = await connection.query(planSql, [rows[0].plan_id])

//         const sql = countUserPosts.replaceAll('?', user_id)
//         const [posts, postFields] = await connection.query(sql);
//         if(posts[0].total_posts >= plans[0].no_of_ads){
//             return await sendError(res, "Advertisement quota is full. Please upgrade the plan.")
//         }
//         next()
//     } catch (error) {
//         return await sendError(res, "Internal Server Error", 500);
//     } finally {
//         connection.release()
//     }
// }

export const checkUserPlanQuotaPermissions = async function (req, res, next) {
    const connection = await pool.getConnection()
    try {
        const sql = fetchPlansAndTotalAdds.replaceAll('?', req.user_id)
        const [userData] = await connection.query(sql);

        if (userData.length === 0) {
            return await sendError(res, "No plans subscribed. Please subscribe to a plan.", 400);
        }

        if (userData.total_posts >= userData.no_of_ads) {
            return await sendError(res, "Advertisement quota is full. Please upgrade the plan.", 403);
        }

        next();
    } catch (error) {
        console.error("Error checking user plan quota permissions:", error);
        return await sendError(res, "Internal Server Error", 500);
    } finally {
        connection.release();
    }
};
