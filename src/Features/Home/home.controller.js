import { sendResponse } from "../../Utility/response.js";
import { getDB } from "../../config/mongodb.js";

export const latestAdds = async function (req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const db = getDB();
        const advertisements = await db.collection("advertisement")
            .find({ is_active: true })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit)
            .toArray();

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

        // Run both queries in parallel using Promise.all
        const [advResults, businessResults] = await Promise.all([
            getDB().collection("advertisement").find({
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
            .toArray(),

            getDB().collection("Business").find({
                $or: [
                    { street: { $regex: search } },
                    { locality: { $regex: search } },
                    { city: { $regex: search } },
                    { state: { $regex: search } },
                    { pincode: { $regex: search } },
                    { name: { $regex: search } },
                    { description: { $regex: search } },
                    { category: { $regex: search } }
                ]
            })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit)
            .toArray()
        ]);

        // Combine the results from both queries
        const advertisements = [...advResults, ...businessResults];

        return await sendResponse(res, "Search Results", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};
