import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import Vehicle from "./Models/VehicleModel.js";

export const addAdvertisement = async (requestBody, files) => {
    try {
        requestBody.images = files;
        const result = new Vehicle(requestBody);
        const savedDoctor = await result.save();
        if (!savedDoctor) {
            return { error: true, data: { message: "Error adding Vehicle.", statusCode: 400, data: null } };
        }
        return { error: false, data: { message: "Vehicle added successfully", statusCode: 200, data: { id: savedDoctor._id } } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

// Get Advertisement
export const getAdvertisement = async (advertisementID) => {
    try {
        const result = await Vehicle.findById(advertisementID).populate('user');

        if (!result) {
            return { error: true, data: { message: "No Vehicle to show.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Vehicle", statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const getListAdvertisement = async () => {
    const db = getDB();
    try {
        const result = await db.collection('advertisement').find({ is_active: true, advType: "Vehicle" }).toArray();
        if (result.length === 0) {
            return { error: true, data: { message: "No Vehicle to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Vehicle list.", statusCode: 200, data: { "Vehicle": result } } };
    } catch (error) {
        console.error(error);
        throw new ApplicationError(error, 500);
    }
};

export const filterAdvertisement = async (query) => {
    const db = getDB();
    try {
        const filter = { is_active: true, advType: 'Vehicle', ...query };
        const result = await db.collection('advertisement').find(filter).sort({ created_at: -1 }).toArray();
        if (result.length === 0) {
            return { error: true, data: { message: "No Vehicle to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Vehicle filter list", statusCode: 200, data: { "Vehicle": result } } };
    } catch (error) {
        console.error(error);
        throw new ApplicationError(error, 500);
    }
};

export const updateAdvertisement = async (advertisementID, updateBody, userId) => {
    try {
        if (!updateBody || typeof updateBody !== 'object') {
            return { error: true, data: { message: "Invalid request body", statusCode: 400, data: null } };
        }
        const result = await Vehicle.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            updateBody,
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Vehicle not updated. No matching Vehicle found for the provided ID.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Vehicle updated successfully", statusCode: 200, data: result } };
    } catch (error) {
        console.log("error in repo", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deactivateAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Vehicle.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: true },
            { is_active: false },
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Vehicle not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Vehicle deactivated successfully.", statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const addImage = async (advertisementID, files, userId) => {
    try {
        const result = await Vehicle.findOne({ _id: advertisementID, user: userId });
        if (!result) {
            return { error: true, data: { message: "Vehicle not found.", statusCode: 404, data: null } };
        }
        result.images = [...Vehicle.images, ...files];
        await result.save();
        return { error: false, data: { data: result, message: "Vehicle image has been added.", statusCode: 200 } };
    } catch (error) {
        console.log("error", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteImage = async (advertisementID, files, userId) => {
    try {
        const result = await Vehicle.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            { $pull: { images: { $in: files } } },
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Vehicle not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { data: null, message: "Images deleted successfully from the Vehicle.", statusCode: 200 } };
    } catch (error) {
        console.log("error", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const activateAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Vehicle.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: false },
            { is_active: true },
            { new: true }
        );

        if (!result) {
            return { error: true, data: { message: "Vehicle not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { data: result, message: "Vehicle activated successfully", statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Vehicle.deleteOne({ _id: advertisementID, user: userId });

        if (result.deletedCount === 0) {
            return { error: true, data: { message: "Vehicle not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Vehicle deleted successfully", statusCode: 200 } };
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