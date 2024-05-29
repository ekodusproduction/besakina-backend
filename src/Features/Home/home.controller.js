import { sendResponse } from "../../Utility/response.js";
import { getDB } from "../../mongodb/mongodb.js";

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
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        // Step 1: Perform text search to get the matching IDs
        const textSearchResults = await getDB().collection("advertisement").find(
            { $text: { $search: search } },
            { projection: { _id: 1, score: { $meta: "textScore" } } }
        ).sort({ score: { $meta: "textScore" } }).toArray();

        const matchingIds = textSearchResults.map(doc => doc._id);

        // Step 2: Use the matching IDs to filter documents with `is_active: true` and paginate
        const advertisements = await getDB().collection("advertisement").find({
            _id: { $in: matchingIds },
            is_active: true
        })
            .sort({ created_at: -1 }) // Sort by creation date as textScore is already used in initial search
            .skip(offset)
            .limit(limit)
            .toArray();

        return await sendResponse(res, "Search Results", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};
