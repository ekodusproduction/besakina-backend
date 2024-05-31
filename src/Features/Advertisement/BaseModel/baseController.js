import { sendError, sendResponse } from "../../../Utility/response.js";
import repository from "./baseRepository.js";
import { logger } from "../../../Middlewares/logger.middleware.js";

export const addAdvertisement = async (req, res, next, Model) => {
    try {
        req.body.user = req.user
        const result = await repository.addAdvertisement(req.body, req.images, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode);
        }
        return await sendResponse(res, result.data.message, 201, result.data.data);
    } catch (error) {
        logger.info(error)
        next(error);
    }
}

export const getAdvertisement = async (req, res, next, Model) => {
    try {
        const advertisementID = req.params.id;
        const result = await repository.getAdvertisement(advertisementID, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, result.data.statusCode, result.data.data);
    } catch (error) {
        logger.info(error)
        next(error);
    }
};

export const getListAdvertisement = async (req, res, next, Model) => {
    try {
        const result = await repository.getListAdvertisement(req.params.id, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, 200, result.data.data);
    } catch (error) {
        logger.info(error)
        next(error);
    }
};

export const filterAdvertisement = async (req, res, next, Model) => {
    try {
        const query = req.query;
        const result = await repository.filterAdvertisement(query, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, 200, result.data.data);
    } catch (error) {
        logger.info(error)
        next(error);
    }
};

export const updateAdvertisement = async (req, res, next, Model) => {
    try {
        const advertisementID = req.params.id;
        const updateBody = req.body;
        const result = await repository.updateAdvertisement(advertisementID, updateBody, req.user, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, 200);
    } catch (error) {
        logger.info(error)
        next(error);
    }
};

export const deactivateAdvertisement = async (req, res, next, Model) => {
    try {
        const advertisementID = req.params.id;
        const result = await repository.deactivateAdvertisement(advertisementID, req.user, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, result.data.statusCode);
    } catch (error) {
        logger.info(error)
        next(error);
    }
}

export const addImage = async (req, res, next, Model) => {
    try {
        const advertisementID = req.params.id;
        const result = await repository.addImage(advertisementID, req.body.images, req.user, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, 200, result.data.data);
    } catch (error) {
        logger.info(error)
        next(error);
    }
};

export const deleteImage = async (req, res, next, Model) => {
    try {
        const advertisementID = req.params.id;
        const result = await repository.deleteImage(advertisementID, req.body.images, req.user, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, 200);
    } catch (error) {
        logger.info(error)
        next(error);
    }
};

export const activateAdvertisement = async (req, res, next, Model) => {
    try {
        const advertisementID = req.params.id;
        const result = await repository.activateAdvertisement(advertisementID, req.user, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, 200);
    } catch (error) {
        logger.info(error)
        next(error);
    }
};

export const deleteAdvertisement = async (req, res, next, Model) => {
    try {
        const advertisementID = req.params.id;
        const result = await repository.deleteAdvertisement(advertisementID, req.user, Model);
        if (result.error) {
            return await sendError(res, result.data.message, result.data.statusCode)
        }
        return await sendResponse(res, result.data.message, 200);
    } catch (error) {
        logger.info(error)
        next(error);
    }
};