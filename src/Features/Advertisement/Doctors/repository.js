import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import { getDB } from "../../../mongodb/mongodb.js";
import Doctor from "./Models/DoctorModel.js";
import DoctorExpertise from "./Models/ExpertiseModel.js";

export const addAdvertisement = async (requestBody, files) => {
    try {
        requestBody.images = files;
        const doctor = new Doctor(requestBody);
        const savedDoctor = await doctor.save();
        if (!savedDoctor) {
            return { error: true, data: { message: "Error adding doctors.", statusCode: 400, data: null } };
        }
        return { error: false, data: { message: "Doctors added successfully", statusCode: 200, data: { id: savedDoctor._id } } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const getAdvertisement = async (advertisementID) => {
    try {
        const doctor = await Doctor.findById(advertisementID).populate('user');

        if (!doctor) {
            return { error: true, data: { message: "No doctors to show.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Doctors", statusCode: 200, data: doctor } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const getListAdvertisement = async () => {
    try {
        const doctors = await Doctor.find({ is_active: true }).sort({ created_at: -1 });

        if (doctors.length === 0) {
            return { error: true, data: { message: "No doctors to show.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Doctors list.", statusCode: 200, data: { "doctors": doctors } } };
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
                    filter.price_per_visit.$gte = parseFloat(query[key]);
                } else if (key === 'maxPrice' && query[key] !== undefined) {
                    if (!filter.price) filter.price = {};
                    filter.price_per_visit.$lte = parseFloat(query[key]);
                } else {
                    filter[key] = query[key];
                }
            }
        }

        console.log("filter", filter);
        const result = await Doctor.find(filter).sort({ created_at: -1 }).exec();
        if (result.length === 0) {
            return { error: true, data: { message: "No property to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Property filter list", statusCode: 200, data: { property: result } } };
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
        const doctor = await Doctor.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            updateBody,
            { new: true }
        );
        if (!doctor) {
            return { error: true, data: { message: "Doctors not updated. No matching doctors found for the provided ID.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Doctors updated successfully", statusCode: 200, data: doctor } };
    } catch (error) {
        console.log("error in repo", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deactivateAdvertisement = async (advertisementID, userId) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: true },
            { is_active: false },
            { new: true }
        );
        if (!doctor) {
            return { error: true, data: { message: "Doctors not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Doctors deactivated successfully.", statusCode: 200, data: doctor } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const addImage = async (advertisementID, files, userId) => {
    try {
        const result = await Doctor.findOne({ _id: advertisementID, user: userId });
        if (!result) {
            return { error: true, data: { message: "Doctors not found.", statusCode: 404, data: null } };
        }
        result.images.push(files[0]);
        await result.save();
        return { error: false, data: { data: [files[0]], message: "Doctor image has been added.", statusCode: 200 } };
    } catch (error) {
        console.log("error", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteImage = async (advertisementID, files, userId) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            { $pull: { images: files } },
            { new: true }
        );
        if (!doctor) {
            return { error: true, data: { message: "Doctors not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { data: null, message: "Images deleted successfully from the doctors", statusCode: 200 } };
    } catch (error) {
        console.log("error", error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const activateAdvertisement = async (advertisementID, userId) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: false },
            { is_active: true },
            { new: true }
        );

        if (!doctor) {
            return { error: true, data: { message: "Doctors not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { data: doctor, message: "Doctors activated successfully", statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteAdvertisement = async (advertisementID, userId) => {
    try {
        const result = await Doctor.deleteOne({ _id: advertisementID, user: userId });

        if (result.deletedCount === 0) {
            return { error: true, data: { message: "Doctors not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Doctors deleted successfully", statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const listExpertise = async () => {
    try {
        const result = await DoctorExpertise.find({});

        if (result.deletedCount === 0) {
            return { error: true, data: { message: "Expertise not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Expertise List.", statusCode: 200, data: { expertise: result } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const addExpertise = async (data) => {
    try {
        const result = await DoctorExpertise.create(data);

        if (!result) {
            return { error: true, data: { message: "Expertise not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "New Expertise add.", statusCode: 200, data: { _id: result._id } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const editExpertise = async (expertiseId, data) => {
    try {
        const result = await DoctorExpertise.updateOne({ _id: expertiseId }, data);

        if (result.nModified === 0) {
            return { error: true, data: { message: "Expertise not found or not modified.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Expertise updated successfully.", statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error.message, 500);
    }
};

export const deleteExpertise = async (expertiseId) => {
    try {
        const result = await DoctorExpertise.deleteOne({ _id: expertiseId });

        if (result.deletedCount === 0) {
            return { error: true, data: { message: "Expertise not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Expertise deleted.", statusCode: 200 } };
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
    listExpertise,
    deleteExpertise,
    addExpertise,
    editExpertise
};

