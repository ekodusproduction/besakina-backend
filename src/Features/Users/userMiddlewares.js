import { sendError } from "../../Utility/response.js"
import User from "./Models/UserModel.js"
import Plan from "../Plans/Models/PlanModel.js"

export const checkUserProfileCompletion = async (req, res, next) => {
    console.log("checking user profile");
    try {
        const userProfile = await User.findById(req.user, 'fullname profile_pic mobile city state').exec();

        if (!userProfile) {
            return sendError(res, "Mobile number not registered. Please login.", 400);
        }
        console.log("user profile >>>>", userProfile)
        if (!userProfile.fullname || !userProfile.mobile || !userProfile.city || !userProfile.profile_pic || !userProfile.state) {
            return sendError(res, "User Profile Incomplete", 400);
        }
        console.log("calling next")
        next();
    } catch (error) {
        console.error("Checking user profile error", error);
        return sendError(res, "Internal Server Error", 500);
    }
};

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
