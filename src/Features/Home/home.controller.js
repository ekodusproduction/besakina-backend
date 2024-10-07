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
        const limit = parseInt(req.query.limit) || 4;
        const page = parseInt(req.query.page) || 1;
        let search = req.query.search || '';
        const offset = (page - 1) * limit;

        const trimmedSearch = search.trim();
        const regexSearch = new RegExp(trimmedSearch, 'i'); 

        const prefixMatch = new RegExp(`^${trimmedSearch}`, 'i');

        const [advResults, businessResults] = await Promise.allSettled([
            Base.find({
                is_active: true,
                $or: [
                    { title: { $regex: prefixMatch } },
                    { title: { $regex: regexSearch, $options: 'i' } }, 
                    { description: { $regex: prefixMatch } },
                    { description: { $regex: regexSearch, $options: 'i' } },
                    { city: { $regex: prefixMatch } },
                    { city: { $regex: regexSearch, $options: 'i' } },
                    { state: { $regex: prefixMatch } },
                    { state: { $regex: regexSearch, $options: 'i' } },
                ]
            })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .exec(),

            Business.find({
                is_active: true,
                $or: [
                    { street: { $regex: prefixMatch } },
                    { street: { $regex: regexSearch, $options: 'i' } },
                    { locality: { $regex: prefixMatch } },
                    { locality: { $regex: regexSearch, $options: 'i' } },
                    { city: { $regex: prefixMatch } },
                    { city: { $regex: regexSearch, $options: 'i' } },
                    { state: { $regex: prefixMatch } },
                    { state: { $regex: regexSearch, $options: 'i' } },
                    { name: { $regex: prefixMatch } },
                    { name: { $regex: regexSearch, $options: 'i' } },
                    { description: { $regex: prefixMatch } },
                    { description: { $regex: regexSearch, $options: 'i' } },
                ]
            })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .exec()
        ]);

        const advData = advResults.status === 'fulfilled' ? advResults.value : [];
        const businessData = businessResults.status === 'fulfilled' ? businessResults.value : [];

        const advertisements = [...advData, ...businessData];

        return await sendResponse(res, "Search Results", 200, { advertisements });
    } catch (error) {
        next(error);
    }
};