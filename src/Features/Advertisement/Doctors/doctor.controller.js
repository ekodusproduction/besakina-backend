import { ApplicationError } from "../../../ErrorHandler/applicationError.js"
import { sendResponse, sendError } from "../../../Utility/response.js";
import pool from "../../../Mysql/mysql.database.js";
import { deleteFiles } from "../../../Utility/deleteFiles.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import repository from "./repository.js";


export const addAdvertisement = async (req, res, next) => {
  try {
    const result = await repository.addAdvertisement(req.body, req.files);
    if (result.error) {
      return sendError(res, result.message, 400);
    }
    return sendResponse(res, result.message, 201, { id: result.id });
  } catch (error) {
    logger(err)
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
    logger(error); // Log the error using logger utility
    return sendError(res, error.message || "Error fetching Doctors", 500);
  }
};

export const getListAdvertisement = async (req, res, next) => {
  try {
    const advertisements = await repository.getListAdvertisement();
    if (!advertisements) {
      return sendError(res, "Doctors not found", 404);
    }
    return sendResponse(res, "Doctors fetched successfully", 200, { advertisements });
  } catch (error) {
    logger(error); // Log the error using logger utility
    return sendError(res, error.message || "Error fetching Doctors", 500);
  }
};

export const filterAdvertisement = async (req, res, next) => {
  try {
    const query = req.query;
    const advertisements = await repository.filterAdvertisement(query);

    if (advertisements.length === 0) {
      return sendError(res, "Doctors not found for given filter", 404);
    }

    advertisements.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });

    return sendResponse(res, "Doctors fetched successfully", 200, { advertisements });
  } catch (error) {
    return sendError(res, error.message || "Error fetching doctors", 500);
  }
};

export const updateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const filter = req.body;
    const result = await repository.updateAdvertisement(advertisementID, filter);
    return sendResponse(res, result.message, 200, { advertisements: result.advertisements });
  } catch (error) {
    return sendError(res, error.message || "Error updating doctors", 500);
  }
};

export const deleteAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deleteAdvertisement(advertisementID);
    return sendResponse(res, result.message, 200, { advertisements: result.advertisements });
  } catch (error) {
    return sendError(res, error.message || "Error deleting doctors", 500);
  }
}

export const addImage = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.addImage(advertisementID, req.files);
    return sendResponse(res, result.message, 200);
  } catch (error) {
    return sendError(res, error.message || "Error adding images to the doctors", 500);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deleteImage(advertisementID, req.body);
    return sendResponse(res, result.message, 200);
  } catch (error) {
    return sendError(res, error.message || "Error deleting images from the doctors", 500);
  }
};

export const listUserAdvertisement = async (req, res, next) => {
  try {
    const result = await repository.listUserAdvertisement(req.user_id);
    return sendResponse(res, result.message, 200, { advertisements: result.advertisements });
  } catch (error) {
    return sendError(res, error.message || "Error fetching user doctors", 500);
  }
};

export const activateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.activateAdvertisement(advertisementID);
    return sendResponse(res, result.message, 200);
  } catch (error) {
    return sendError(res, error.message || "Error activating doctors", 500);
  }
};