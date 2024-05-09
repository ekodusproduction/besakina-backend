import { ApplicationError } from "../../../ErrorHandler/applicationError.js"
import { sendResponse, sendError } from "../../../Utility/response.js";
import pool from
  "../../../Mysql/mysql.database.js";
// import path from 'path';  // Import path module
import { insertQuery, selectQuery, updateQuery, selectJoinQuery, filterQuery } from "../../../Utility/sqlQuery.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import repository from "./repository.js";

export const addAdvertisement = async (req, res, next) => {
  try {
    req.body.user_id = req.user_id
    const result = await repository.addAdvertisement(req.body, req.files);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode);
    }
    return sendResponse(res, result.data.message, 201, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
}

export const getAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.getAdvertisement(advertisementID);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.data.message, result.data.statusCode, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const getListAdvertisement = async (req, res, next) => {
  try {
    const result = await repository.getListAdvertisement(req.params.id);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.data.message, 200, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const filterAdvertisement = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await repository.filterAdvertisement(query);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.data.message, 200, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const updateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const updateBody = req.body;
    const result = await repository.updateAdvertisement(advertisementID, updateBody, req.user_id);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deactivateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deactivateAdvertisement(advertisementID, req.user_id);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.data.message, result.data.statusCode);
  } catch (error) {
    logger.info(error)
    next(error);
  }
}

export const addImage = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.addImage(advertisementID, req.files, req.user_id);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.data.message, 200, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deleteImage(advertisementID, req.body.images, req.user_id);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const activateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.activateAdvertisement(advertisementID, req.user_id);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deleteAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deleteAdvertisement(advertisementID, req.user_id);
    if (result.error) {
      return sendError(res, result.data.message, result.data.statusCode)
    }
    return sendResponse(res, result.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};