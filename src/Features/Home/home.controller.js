import { sendResponse } from "../../Utility/response.js";
import { getDB } from "../../mongodb/mongodb.js";

export const latestAdds = async function (req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const advertisements = await getDB().collection("advertisement").aggregate([
            { $match: { is_active: true } },
            { $sort: { created_at: -1 } },
            { $skip: offset },
            { $limit: limit }
        ]).toArray();

        return await sendResponse(res, "Latest Ads", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};

export const searchAdds = async function (req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const page = parseInt(req.query.page) || 1;
        let search = req.query.search || '';
        const offset = (page - 1) * limit;
        search = new RegExp(search, 'i');

        const advertisements = await getDB().collection("advertisement").find({
            $or: [
                { title: { $regex: search } },
                { description: { $regex: search } },
                { city: { $regex: search } },
                { state: { $regex: search } },
                { category: { $regex: search } },
                { price: { $regex: search } },
                { type: { $regex: search } }
            ]
        })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit)
            .toArray();

        return await sendResponse(res, "Search Results", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};