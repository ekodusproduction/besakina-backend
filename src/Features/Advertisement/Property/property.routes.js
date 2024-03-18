import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement
} from "./property.controller.js"

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut } from "./property.validation.js";
import { editImagesValidator } from "../../../Utility/editImagesValidator.js";
const propertyRouter = Router()

//protected routes id=> advertisement id
propertyRouter.post("/:category", jwtAuth,  fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)

propertyRouter.get("/:category/filter",  filterAdvertisement)

propertyRouter.put("/:category/id/:id", jwtAuth,  validationMiddlewarePut, updateAdvertisement)
propertyRouter.delete("/:category/id/:id", jwtAuth, deleteAdvertisement)

propertyRouter.get("/:category/id/:id", getAdvertisement)
// images
//id =>advertisement id
propertyRouter.delete("/:category/image/delete/:id", jwtAuth,  deleteImage)

propertyRouter.post("/:category/images/:id", jwtAuth,  fileUpload("images").array("images"), editImagesValidator, addImage)
// list user own advertisement //id => user id
propertyRouter.get("/:category/list/self", jwtAuth,  listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
propertyRouter.get("/:category/list",  getListAdvertisement)



export default propertyRouter