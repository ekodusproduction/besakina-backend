import { sendResponse } from "../../Utility/response.js";
import Base from "../Advertisement/BaseModel/BaseModel.js";
import Business from "../BusinessListing/Model/BusinessModel.js";
import { getDB } from "../../config/mongodb.js";

export const businessInfo = async (req, res, next) => {
    try {
        let advertisements = await Business.find({ is_active: true })
            .select('created_at category street city locality')
            .populate({
                path: 'user',
                select: 'plan fullname mobile'
            });

        return sendResponse(res, 'Business Info List', 200, advertisements, null);
    } catch (error) {
        next(error);
    }
};

export const advertisementInfo = async (req, res, next) => {
    try {
        const db = getDB(); 

        const advertisements = await db.collection("advertisement").aggregate([
            { $match: { is_active: true } }, 
            {
                $lookup: {
                    from: 'user',           // Join with the 'user' collection
                    localField: 'user',     // Field in the 'advertisement' collection
                    foreignField: '_id',    // Field in the 'user' collection
                    as: 'user'              // Resulting field in the output
                }
            },
            { $unwind: '$user' }, 
            {
                $project: {  
                    created_at: 1,
                    category: 1,
                    street: 1,
                    city: 1,
                    locality: 1,
                    advType: 1,
                    'user.plan': 1,
                    'user.fullname': 1,
                    'user.mobile': 1
                }
            }
        ]).toArray();

        return sendResponse(res, 'Advertisement Info List', 200, advertisements, null);
    } catch (error) {
        next(error); 
    }
};

