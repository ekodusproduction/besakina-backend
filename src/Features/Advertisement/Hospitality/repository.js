import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import Hospitality from "./Models/HospitalityModel.js";

export const addAdvertisement = async (requestBody, files) => {
    try {
        requestBody.images = files;
        const result = new Hospitality(requestBody);
        const savedDoctor = await result.save();
        if (!savedDoctor) {
            return { error: true, data: { message: "Error adding Hospitality.", statusCode: 400, data: null } };
        }
        return { error: false, data: { message: "Hospitality added successfully", statusCode: 200, data: { id: savedDoctor._id } } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const getAdvertisement = async (advertisementID) => {
    try {
        const result = await Hospitality.findById(advertisementID).populate('user');

        if (!result) {
            return { error: true, data: { message: "No Hospitality to show.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Hospitality", statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

// Get List of Advertisements
export const getListAdvertisement = async () => {
    try {
        const result = await Hospitality.find({ is_active: true });
        if (result.length === 0) {
            return { error: true, data: { message: "No Hospitality to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospitality list.", statusCode: 200, data: { "Hospitality": result } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

const filterAdvertisement = async (query) => {
    const db = getDB();
    try {
        const filter = { is_active: true, discriminatorKey: 'Hospitality', ...query };
        console.log("filter", filter)
        const result = await db.collection('advertisement').find(filter).sort({ created_at: -1 }).toArray();
        if (result.length === 0) {
            return { error: true, data: { message: "No Hospitality to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospitality filter list", statusCode: 200, data: { "Hospitality": result } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const updateAdvertisement = async (advertisementID, updateBody, userId) => {
    try {
        if (!updateBody || typeof updateBody !== 'object') {
            return { error: true, data: { message: "Invalid request body", statusCode: 400, data: null } };
        }
        const result = await Hospitality.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            updateBody,
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Hospitality not updated. No matching Hospitality found for the provided ID.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospitality updated successfully", statusCode: 200, data: result } };
    } catch (error) {
        console.log("error in repo", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deactivateAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Hospitality.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: true },
            { is_active: false },
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Hospitality not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospitality deactivated successfully.", statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const addImage = async (advertisementID, files, userId) => {
    try {
        const result = await Hospitality.findOne({ _id: advertisementID, user: userId });
        if (!result) {
            return { error: true, data: { message: "Hospitality not found.", statusCode: 404, data: null } };
        }
        result.images = [...Hospitality.images, ...files];
        await result.save();
        return { error: false, data: { data: result, message: "Hospitality image has been added.", statusCode: 200 } };
    } catch (error) {
        console.log("error", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteImage = async (advertisementID, files, userId) => {
    try {
        const result = await Hospitality.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            { $pull: { images: { $in: files } } },
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Hospitality not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { data: null, message: "Images deleted successfully from the Hospitality.", statusCode: 200 } };
    } catch (error) {
        console.log("error", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const activateAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Hospitality.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: false },
            { is_active: true },
            { new: true }
        );

        if (!result) {
            return { error: true, data: { message: "Hospitality not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { data: result, message: "Hospitality activated successfully", statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Hospitality.deleteOne({ _id: advertisementID, user: userId });

        if (result.deletedCount === 0) {
            return { error: true, data: { message: "Hospitality not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Hospitality deleted successfully", statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};


export default {
    addAdvertisement,
    getAdvertisement,
    getListAdvertisement,
    filterAdvertisement,
    deactivateAdvertisement,
    updateAdvertisement,
    addImage,
    activateAdvertisement,
    deleteImage,
    deleteAdvertisement
};