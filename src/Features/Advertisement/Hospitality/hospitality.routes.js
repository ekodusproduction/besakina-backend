import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement
} from "./hospitality.validation.js"

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut } from "./hospitality.validation.js";
import { editImagesValidator } from "../../../Utility/editImagesValidator.js";
const hospitalityRouter = Router()

//protected routes id=> advertisement id
hospitalityRouter.post("/:category", jwtAuth, fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)

hospitalityRouter.get("/:category/filter", filterAdvertisement)

hospitalityRouter.put("/:category/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)
hospitalityRouter.delete("/:category/id/:id", jwtAuth, deleteAdvertisement)

hospitalityRouter.get("/:category/id/:id", getAdvertisement)
// images
//id =>advertisement id
hospitalityRouter.delete("/:category/image/delete/:id", jwtAuth, deleteImage)

hospitalityRouter.post("/:category/images/:id", jwtAuth, fileUpload("images").array("images"), editImagesValidator, addImage)
// list user own advertisement //id => user id
hospitalityRouter.get("/:category/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
hospitalityRouter.get("/:category/list", getListAdvertisement)



export default hospitalityRouter