import { sendError } from "../../Utility/response.js"
import User from "./Models/UserModel.js"
import Plan from "../Plans/Models/PlanModel.js"

export const checkUserProfileCompletion = async (req, res, next) => {
    console.log("checking user profile");
    try {
        const userProfile = await User.findById(req.user, 'fullname email mobile city state').exec();

        if (!userProfile) {
            return sendError(res, "Mobile number not registered. Please login.", 400);
        }
        if (!userProfile.fullname || !userProfile.mobile || !userProfile.city || !userProfile.profile_pic || !userProfile.state) {
            return sendError(res, "User profile incomplete.", 400);
        }
        next();
    } catch (error) {
        console.error("Checking user profile error", error);
        return sendError(res, "Internal Server Error", 500);
    }
};

// export const checkUserPlanQuotaPermissions = async function (req, res, next) {
//     const connection = await pool.getConnection()
//     try {
//         const selectUser = `SELECT * FROM userselectedplans WHERE user = ?`
//         const [rows, fields] = await connection.query(selectUser, [req.user])
//         const userProfile = rows[0];
//         const planSql = `SELECT * FROM plans WHERE id = ?`
//         const [plans, planFields] = await connection.query(planSql, [rows[0].plan_id])

//         const sql = countUserPosts.replaceAll('?', user)
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

export const checkUserPlanQuotaPermissions = async (req, res, next) => {
    try {
        const user = await User.findById(req.user).populate('plan').exec();

        if (!user || !user.plan) {
            return sendError(res, "No plans subscribed. Please subscribe to a plan.", 400);
        }

        const userPostsCount = await Post.countDocuments({ user: req.user });

        if (userPostsCount >= user.plan.no_of_ads) {
            return sendError(res, "Advertisement quota is full. Please upgrade the plan.", 403);
        }

        next();
    } catch (error) {
        console.error("Error checking user plan quota permissions:", error);
        return sendError(res, "Internal Server Error", 500);
    }
};
