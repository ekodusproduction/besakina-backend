// repositories/advertisementRepository.js

import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import Hospital from "./Models/HospitalModel.js";

export const addAdvertisement = async (requestBody, files) => {
    try {
        requestBody.images = files;
        const result = new Hospital(requestBody);
        const savedDoctor = await result.save();
        if (!savedDoctor) {
            return { error: true, data: { message: "Error adding Hospital.", statusCode: 400, data: null } };
        }
        return { error: false, data: { message: "Hospital added successfully", statusCode: 200, data: { id: savedDoctor._id } } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

// Get Advertisement
export const getAdvertisement = async (advertisementID) => {
    try {
        const result = await Hospital.findById(advertisementID).populate('user');

        if (!result) {
            return { error: true, data: { message: "No Hospital to show.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Hospital", statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

// Get List of Advertisements
export const getListAdvertisement = async () => {
    try {
        const result = await Hospital.find({ is_active: true });
        if (result.length === 0) {
            return { error: true, data: { message: "No Hospital to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospital list.", statusCode: 200, data: { "hospital": result } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

const filterAdvertisement = async (query) => {
    const db = getDB();
    try {
        const filter = { is_active: true, discriminatorKey: 'Hospital', ...query };
        console.log("filter", filter)
        const result = await db.collection('advertisement').find(filter).sort({ created_at: -1 }).toArray();
        if (result.length === 0) {
            return { error: true, data: { message: "No Hospital to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospital filter list", statusCode: 200, data: { "Hospital": result } } };
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
        const result = await Hospital.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            updateBody,
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Hospital not updated. No matching Hospital found for the provided ID.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospital updated successfully", statusCode: 200, data: result } };
    } catch (error) {
        console.log("error in repo", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deactivateAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Hospital.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: true },
            { is_active: false },
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Hospital not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospital deactivated successfully.", statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const addImage = async (advertisementID, files, userId) => {
    try {
        const result = await Hospital.findOne({ _id: advertisementID, user: userId });
        if (!result) {
            return { error: true, data: { message: "Hospital not found.", statusCode: 404, data: null } };
        }
        result.images = [...Hospital.images, ...files];
        await result.save();
        return { error: false, data: { data: result, message: "Hospital image has been added.", statusCode: 200 } };
    } catch (error) {
        console.log("error", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteImage = async (advertisementID, files, userId) => {
    try {
        const result = await Hospital.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            { $pull: { images: { $in: files } } },
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Hospital not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { data: null, message: "Images deleted successfully from the Hospital.", statusCode: 200 } };
    } catch (error) {
        console.log("error", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const activateAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Hospital.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: false },
            { is_active: true },
            { new: true }
        );

        if (!result) {
            return { error: true, data: { message: "Hospital not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { data: result, message: "Hospital activated successfully", statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Hospital.deleteOne({ _id: advertisementID, user: userId });

        if (result.deletedCount === 0) {
            return { error: true, data: { message: "Hospital not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Hospital deleted successfully", statusCode: 200 } };
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