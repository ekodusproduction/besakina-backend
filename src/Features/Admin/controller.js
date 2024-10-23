import { sendResponse } from "../../Utility/response.js";
import Base from "../Advertisement/BaseModel/BaseModel.js";
import Business from "../BusinessListing/Model/BusinessModel.js";
import User from "../Users/Models/UserModel.js";
export const businessInfo = async (req, res, next) => {
    try {
        let user = await Business.find({ is_active: true }).select({
            advType: 1, created_at: 1,
            category: 1, street: 1, city: 1, locality : 1
        }).populate('User').select({
            plan: 1, fullname: 1, mobile: 1,
        });

        return await sendResponse(res, 'Business Info List', 200, user, null);
    } catch (error) {
        next(error);
    }
};

export const advertisementInfo = async (req, res, next) => {
    try {
        let user = await Base.find({ is_active: true }).select({
            created_at: 1, category: 1, street: 1,
            city: 1, locality: 1
        }).populate('User').select({
            plan: 1, fullname: 1, mobile: 1,
        });

        return await sendResponse(res, 'Advertisement Info List', 200, user, null);
    } catch (error) {
        next(error);
    }
};
