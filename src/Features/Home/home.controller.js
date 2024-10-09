import { sendResponse } from "../../Utility/response.js";
import { getDB } from "../../config/mongodb.js";
import Base from "../Advertisement/BaseModel/BaseModel.js";
import Business from "../BusinessListing/Model/BusinessModel.js";

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
        const db = await getDB();
        const limit = parseInt(req.query.limit) || 4;
        const page = parseInt(req.query.page) || 1;
        let search = req.query.search || '';
        const offset = (page - 1) * limit;

        // Define the text search query
        const textSearchQuery = search.trim() ? { $text: { $search: search } } : {};

        // Define the projection for textScore
        const projection = {
            score: { $meta: "textScore" }
        };

        // Perform text search on the `advertisement` and `business` collections
        const [advResults, businessResults] = await Promise.allSettled([
            db.collection('advertisement')
                .find({ is_active: true, ...textSearchQuery }, { projection })
                .sort({ score: { $meta: "textScore" } })
                .skip(offset)
                .limit(limit)
                .toArray(),

            db.collection('business')
                .find({ is_active: true, ...textSearchQuery }, { projection })
                .sort({ score: { $meta: "textScore" } })
                .skip(offset)
                .limit(limit)
                .toArray()
        ]);

        const advData = advResults.status === 'fulfilled' ? advResults.value : [];
        const businessData = businessResults.status === 'fulfilled' ? businessResults.value : [];

        const advertisements = [...advData, ...businessData];

        return await sendResponse(res, "Search Results", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};