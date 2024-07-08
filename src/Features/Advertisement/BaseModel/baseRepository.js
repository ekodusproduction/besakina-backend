import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import { getDB } from "../../../mongodb/mongodb.js";

export const addAdvertisement = async (requestBody, files, Model) => {
    try {
        requestBody.images = files;
        const document = new Model(requestBody);
        const result = await document.save();
        if (!result) {
            return { error: true, data: { message: `Error adding ${Model}.`, statusCode: 400, data: null } };
        }
        return { error: false, data: { message: `${Model} added successfully`, statusCode: 200, data: { id: result._id } } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const getAdvertisement = async (advertisementID, Model) => {
    try {
        const result = await Model.findById(advertisementID).populate('user');

        if (!result) {
            return { error: true, data: { message: `No ${Model} to show.`, statusCode: 404, data: null } };
        }

        return { error: false, data: { message: `${Model}`, statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const getListAdvertisement = async (Model) => {
    try {
        const result = await Model.find({ is_active: true }).sort({ created_at: -1 });

        if (result.length === 0) {
            return { error: true, data: { message: `No ${Model} to show.`, statusCode: 404, data: null } };
        }

        return { error: false, data: { message: `${Model} list.`, statusCode: 200, data: { [Model]: result } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

const filterAdvertisement = async (query, Model) => {
    const db = getDB();
    try {
        const filter = { is_active: true, discriminatorKey: `${Model}`, ...query };
        const doctors = await db.collection('advertisement').find(filter).sort({ created_at: -1 }).toArray();
        if (doctors.length === 0) {
            return { error: true, data: { message: "No doctors to show.", statusCode: 404, data: null } };
        }
        return { error: false, data: { message: "Doctors filter list", statusCode: 200, data: { "property": doctors } } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const updateAdvertisement = async (advertisementID, updateBody, userId, Model) => {
    try {
        if (!updateBody || typeof updateBody !== 'object') {
            return { error: true, data: { message: "Invalid request body", statusCode: 400, data: null } };
        }
        const result = await Model.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            updateBody,
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: `${Model} not updated. No matching ${Model} found for the provided ID.`, statusCode: 404, data: null } };
        }
        return { error: false, data: { message: `${Model} updated successfully`, statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deactivateAdvertisement = async (advertisementID, userId, Model) => {
    try {
        const result = await Model.findOneAndUpdate(
            { _id: advertisementID, user: userId, is_active: true },
            { is_active: false },
            { new: true }
        );
        if (!result) {
            return { error: true, data: { message: `${Model}  not found.`, statusCode: 404, data: null } };
        }
        return { error: false, data: { message: `${Model} deactivated successfully`, statusCode: 200, data: result } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const addImage = async (advertisementID, files, userId, Model) => {
    try {
        const result = await Model.findOne({ _id: advertisementID, user: userId });
        if (!result) {
            return { error: true, data: { message: `${Model}  not found.`, statusCode: 404, data: null } };
        }
        result.images.push(files[0]);
        await doctor.save();
        return { error: false, data: { data: [files[0]], message: `${Model} image has been added.`, statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const deleteImage = async (advertisementID, files, userId) => {
    try {
        const doctor = await Model.findOneAndUpdate(
            { _id: advertisementID, user: userId },
            { $pull: { images: files } },
            { new: true }
        );
        if (!doctor) {
            return { error: true, data: { message: "Doctors not found.", statusCode: 404, data: null } };
        }
        return { error: false, data: { data: null, message: "Images deleted successfully from the doctors", statusCode: 200 } };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
};

export const activateAdvertisement = async (advertisementID, userId) => {
    try {
        const doctor = await Model.findOneAndUpdate(
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
        const result = await Model.deleteOne({ _id: advertisementID, user: userId });

        if (result.deletedCount === 0) {
            return { error: true, data: { message: "Doctors not found.", statusCode: 404, data: null } };
        }

        return { error: false, data: { message: "Doctors deleted successfully", statusCode: 200 } };
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