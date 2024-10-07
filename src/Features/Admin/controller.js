import Base from "../Advertisement/BaseModel/BaseModel.js";
import Business from "../BusinessListing/Model/BusinessModel.js";

export const businessInfo = async (req, res, next) => {
    try {
        let user = await Business.find({ is_active: true }).populate('user');

        return await sendResponse(res, 'Business Info List', 201, user, null);
    } catch (error) {
        next(error);
    }
};

export const advertisementInfo = async (req, res, next) => {
    try {
        let user = await Base.find({ is_active: true }).populate('user');

        return await sendResponse(res, 'Advertisement Info List', 201, user, null);
    } catch (error) {
        next(error);
    }
};
