import { sendResponse } from "../../Utility/response.js";
import Base from "../Advertisement/BaseModel/BaseModel.js";
import Business from "../BusinessListing/Model/BusinessModel.js";
import User from "../Users/Models/UserModel.js";

export const businessInfo = async (req, res, next) => {
    try {
        let advertisements = await Business.find({ is_active: true })
            .select('created_at category street city locality') 
            .populate({
                path: 'User', 
                select: 'plan fullname mobile' 
            });

        return sendResponse(res, 'Business Info List', 200, advertisements, null);
    } catch (error) {
        next(error);
    }
};

export const advertisementInfo = async (req, res, next) => {
    try {
        let advertisements = await Base.find({ is_active: true })
            .select('created_at category street city locality advType') 
            .populate({
                path: 'User', 
                select: 'plan fullname mobile' 
            });

        return sendResponse(res, 'Advertisement Info List', 200, advertisements, null);
    } catch (error) {
        next(error);
    }
};
