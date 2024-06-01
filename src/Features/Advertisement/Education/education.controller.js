import { ApplicationError } from "../../../ErrorHandler/applicationError.js"
import { sendResponse, sendError } from "../../../Utility/response.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import repository from "./repository.js";

export const addAdvertisement = async (req, res, next) => {
  try {
    req.body.user = req.user
    console.log("body", req.body)

    const result = await repository.addAdvertisement(req.body, req.images);
    console.log("result", result)
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode);
    }
    console.log("result no error", result)
    return await sendResponse(res, result.data.message, 201, result.data.data);
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
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, result.data.statusCode, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const getListAdvertisement = async (req, res, next) => {
  try {
    const result = await repository.getListAdvertisement(req.params.id);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200, result.data.data);
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
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const updateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const updateBody = req.body;
    const result = await repository.updateAdvertisement(advertisementID, updateBody, req.user);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deactivateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deactivateAdvertisement(advertisementID, req.user);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, result.data.statusCode);
  } catch (error) {
    logger.info(error)
    next(error);
  }
}

export const addImage = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.addImage(advertisementID, req.images, req.user);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deleteImage(advertisementID, req.body.images, req.user);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const activateAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.activateAdvertisement(advertisementID, req.user);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deleteAdvertisement = async (req, res, next) => {
  try {
    const advertisementID = req.params.id;
    const result = await repository.deleteAdvertisement(advertisementID, req.user);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};


export const listEducationFormData = async (req, res, next) => {
  try {
    const fieldname = req.params.fieldname;

    const result = await repository.listEducationFormData(fieldname);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const addEducationFormData = async (req, res, next) => {
  try {
    const result = await repository.addEducationFormData(req.body, req.body.fieldname);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200, result.data.data);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const editEducationFormData = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body
    const result = await repository.editEducationFormData(id, data, req.body.fieldname);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};

export const deleteEducationFormData = async (req, res, next) => {
  try {
    const result = await repository.deleteEducationFormData(req.params.id, req.params.fieldname);
    if (result.error) {
      return await sendError(res, result.data.message, result.data.statusCode)
    }
    return await sendResponse(res, result.data.message, 200);
  } catch (error) {
    logger.info(error)
    next(error);
  }
};