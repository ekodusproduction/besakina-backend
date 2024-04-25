import { ApplicationError } from "../../../ErrorHandler/applicationError.js"
import { sendResponse, sendError } from "../../../Utility/response.js";
import pool from "../../../Mysql/mysql.database.js";
// import path from 'path';  // Import path module
import { insertQuery, selectQuery, updateQuery, selectJoinQuery, filterQuery } from "../../../Utility/sqlQuery.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import repository from "./repository.js";

export const addAdvertisement = async (req, res, next) => {
  try {
    req.body.user_id = req.user_id
    console.log("req", "received")

    const result = await repository.addAdvertisement(req.body, req.files);
    if (result.error) {
      return sendError(res, result.message, 400);
    }
    return sendResponse(res, result.message, 201, { id: result.id });
  } catch (error) {
    logger.info(error)
    next(error);
  }
}

export const getAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const advertisement = await repository.getAdvertisement(advertisementID);
    if (!advertisement) {
      return sendError(res, "Doctors not found", 404);
    }
    return sendResponse(res, "Doctors fetched successfully", 200, { advertisement });
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const getListAdvertisement = async (req, res, next) => {
  try {
    const advertisements = await repository.getListAdvertisement(req.params.id);
    if (!advertisements) {
      return sendError(res, "Doctors not found", 404);
    }
    return sendResponse(res, "Doctors fetched successfully", 200, { advertisements });
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const filterAdvertisement = async (req, res, next) => {
  try {
    const query = req.query;
    const advertisements = await repository.filterAdvertisement(query);

    if (advertisements.length === 0) {
      return sendError(res, "Doctors not found for given filter", 404);
    }

    return sendResponse(res, "Doctors fetched successfully", 200, { advertisements });
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const updateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const filter = req.body;
    const result = await repository.updateAdvertisement(advertisementID, filter);
    if (result.length === 0) {
      return sendError(res, "Doctors not found for given filter", 404);
    }
    return sendResponse(res, result.message, 200, { advertisements: result.advertisements });
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deactivateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deactivateAdvertisement(advertisementID);
    return sendResponse(res, result.message, 200, { advertisements: result.advertisements });
  } catch (error) {
    logger.info(error)
    next(error);
  }
}

export const addImage = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.addImage(advertisementID, req.files);
    return sendResponse(res, result.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deleteImage(advertisementID, req.body.images);
    return sendResponse(res, result.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const listUserAdvertisement = async (req, res, next) => {
  try {
    const result = await repository.listUserAdvertisement(req.user_id);
    return sendResponse(res, result.message, 200, { advertisements: result.advertisements });
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const activateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.activateAdvertisement(advertisementID);
    return sendResponse(res, result.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};