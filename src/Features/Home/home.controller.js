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

        const advertisements = await getDB().collection("advertisement").aggregate([
            {
                $match: { is_active: true } // First filter by is_active
            },
            {
                $match: { $text: { $search: search } } // Then perform the text search
            },
            {
                $addFields: { score: { $meta: "textScore" } } // Add the relevance score
            },
            {
                $sort: { score: { $meta: "textScore" }, created_at: -1 } // Sort by relevance and creation date
            },
            {
                $skip: offset // Skip the documents for pagination
            },
            {
                $limit: limit // Limit the number of documents
            }
        ]).toArray();

        return await sendResponse(res, "Search Results", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};
