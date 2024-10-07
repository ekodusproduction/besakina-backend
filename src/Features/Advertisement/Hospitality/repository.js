import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import HospitalityFormData from "./Models/HospitalityFormModel.js";
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
        const result = await Hospitality.findOneAndUpdate(
            { _id: advertisementID },
            { $inc: { views: 1 }},
            { new: true }
        ).populate('user');

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
export const getListAdvertisement = async (limit, offset) => {
    try {
        const result = await Hospitality.find({ is_active: true }).sort({ created_at: -1 }).skip(offset)
            .limit(limit);
        if (result.length === 0) {
            return { error: true, data: { message: "No Hospitality to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospitality list.", statusCode: 200, data: { "hospitality": result } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

const filterAdvertisement = async (query) => {
    try {
        // Build the filter object
        const filter = { is_active: true };

        // Add dynamic filters based on the query parameters
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                if (key === 'minPrice' && query[key] !== undefined) {
                    if (!filter.price) filter.price = {};
                    filter.price.$gte = parseFloat(query[key]);
                } else if (key === 'maxPrice' && query[key] !== undefined) {
                    if (!filter.price) filter.price = {};
                    filter.price.$lte = parseFloat(query[key]);
                } else {
                    filter[key] = query[key];
                }
            }
        }

        const result = await Hospitality.find(filter).sort({ created_at: -1 });
        if (result.length === 0) {
            return { error: true, data: { message: "No hospitality to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Hospitality filter list", statusCode: 200, data: { hospitality: result } } };
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
        result.images.push(files[0]);
        await result.save();
        return { error: false, data: { data: [files[0]], message: "Hospitality image has been added.", statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteImage = async (advertisementID, files, userId) => {
    try {
    
        const result = await Hospitality.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            { $pull: { images: files } },
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: "Hospitality not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { data: null, message: "Images deleted successfully from the Hospitality.", statusCode: 200 } };
    } catch (error) {
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

export const listFormData = async (fieldname) => {
    try {
        const result = await HospitalityFormData.find({ fieldname: fieldname });
        if (result.deletedCount === 0) {
            return { error: true, data: { message: `${fieldname} not found.`, statusCode: 404, data: null } };
        }
        return { error: false, data: { message: `${fieldname} List.`, statusCode: 200, data: { [fieldname]: result } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const addFormData = async (data, fieldname) => {
    try {
        const result = await HospitalityFormData.create(data);
        if (!result) {
            return { error: true, data: { message: `${fieldname} not found.`, statusCode: 404, data: null } };
        }
        return { error: false, data: { message: `New ${fieldname} added.`, statusCode: 200, data: { _id: result._id } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const editFormData = async (expertiseId, data, fieldname) => {
    try {
        const result = await HospitalityFormData.updateOne({ _id: expertiseId }, data);

        if (result.nModified === 0) {
            return { error: true, data: { message: `${fieldname} not found.`, statusCode: 404, data: null } };
        }

        return { error: false, data: { message: `${fieldname} updated.`, statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error.message, 500);
    }
};

export const deleteFormData = async (id, fieldname) => {
    try {
        const result = await HospitalityFormData.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return { error: true, data: { message: `${fieldname} not found.`, statusCode: 404, data: null } };
        }

        return { error: false, data: { message: `${fieldname} deleted.`, statusCode: 200 } };
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
    deleteAdvertisement,
    deleteFormData,
    addFormData,
    editFormData,
    listFormData,
};