import Banner from "./BannerModel.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { logger } from "../../Middlewares/logger.middleware.js";

const getBanner = async (type = null) => {
    try {
        let sampleCount = 7;
        let matchQuery = { isActive: true };
        if (type != null) {
            matchQuery.type = type;
            sampleCount = await Banner.countDocuments(matchQuery);

        }
        console.log('matchQuery', matchQuery)
        console.log("sampleCount", sampleCount);
        const data = await Banner.aggregate([
            { $match: matchQuery },
            { $sample: { size: sampleCount } },
            {
                $project: {
                    images: 1,
                    _id: 0
                }

            }
        ]);

        return { error: false, data: { message: "Banner list.", statusCode: 200, data } };
    } catch (error) {
        logger.error(error);
        throw new ApplicationError(error, 500);
    }
};

const addBanner = async (requestBody, files) => {
    try {
        requestBody.images = files[0];
        const banner = new Banner(requestBody);
        const savedBanner = await banner.save();
        return { error: false, data: { message: "Banner added successfully", statusCode: 201, data: { id: savedBanner._id } } };
    } catch (error) {
        logger.error(error);
        throw new ApplicationError(error, 500);
    }
};

const editBanner = async (id, body, files) => {
    try {
        body.images = files;
        const banner = await Banner.findOneAndUpdate({ _id: id }, body, { new: true });
        return { error: false, data: { message: "Banner edited successfully.", statusCode: 200 } };
    } catch (error) {
        logger.error(error);
        throw new ApplicationError(error, 500);
    }
};

const deleteBanner = async (id) => {
    try {
        await Banner.deleteOne({ _id: id });
        return { error: false, data: { message: "Banner deleted successfully", statusCode: 200 } };
    } catch (error) {
        logger.error(error);
        throw new ApplicationError(error, 500);
    }
};

export default {
    getBanner, addBanner, editBanner, deleteBanner
};
