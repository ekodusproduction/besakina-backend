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
                    from: 'user',           
                    localField: 'user',     
                    foreignField: '_id',    
                    as: 'user'              
                }
            },
            {
                $project: {  
                    created_at: 1,
                    category: 1,
                    street: 1,
                    city: 1,
                    locality: 1,
                    advType: 1,
                    'user.plan': { $arrayElemAt: ['$user.plan', 0] }, 
                    'user.fullname': { $arrayElemAt: ['$user.fullname', 0] },
                    'user.mobile': { $arrayElemAt: ['$user.mobile', 0] }
                }
            }
        ]).toArray();

        // Send response
        return sendResponse(res, 'Advertisement Info List', 200, advertisements, null);
    } catch (error) {
        next(error); 
    }
};


