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
        const limit = parseInt(req.query.limit) || 4;
        const page = parseInt(req.query.page) || 1;
        let search = req.query.search || '';
        const offset = (page - 1) * limit;

        const [advResults, businessResults] = await Promise.allSettled([
            getDB().collection("advertisement").find({
                is_active: true,
                $text: { $search: search } // Use search directly
            })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit)
            .toArray(),

            getDB().collection("businesses").find({
                is_active: true,
                $text: { $search: search } // Use search directly
            })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit)
            .toArray()
        ]);

        console.log("business", businessResults);
        // Extract the fulfilled results
        const advData = advResults.status === 'fulfilled' ? advResults.value : [];
        const businessData = businessResults.status === 'fulfilled' ? businessResults.value : [];

        // Combine the results
        const advertisements = [...advData, ...businessData];

        return await sendResponse(res, "Search Results", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};
