import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement
} from "./education.controller.js"

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut } from "./education.validation.js";
import { editImagesValidator } from "../../../Utility/editImagesValidator.js";
const educationRouter = Router()

//protected routes id=> advertisement id
educationRouter.post("/:category", jwtAuth,  fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)

educationRouter.get("/:category/filter",  filterAdvertisement)

educationRouter.put("/:category/id/:id", jwtAuth,  validationMiddlewarePut, updateAdvertisement)
educationRouter.delete("/:category/id/:id", jwtAuth, deleteAdvertisement)

educationRouter.get("/:category/id/:id", getAdvertisement)
// images
//id =>advertisement id
educationRouter.delete("/:category/image/delete/:id", jwtAuth,  deleteImage)

educationRouter.post("/:category/images/:id", jwtAuth,  fileUpload("images").array("images"), editImagesValidator, addImage)
// list user own advertisement //id => user id
educationRouter.get("/:category/list/self", jwtAuth,  listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
educationRouter.get("/:category/list",  getListAdvertisement)

export default educationRouter