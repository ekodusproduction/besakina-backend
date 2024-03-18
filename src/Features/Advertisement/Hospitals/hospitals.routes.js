import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement
} from "./hospitals.validation.js"

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut } from "./hospitals.validation.js";
import { editImagesValidator } from "../../../Utility/editImagesValidator.js";
const hospitalsRouter = Router()

//protected routes id=> advertisement id
hospitalsRouter.post("/:category", jwtAuth, fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)

hospitalsRouter.get("/:category/filter", filterAdvertisement)

hospitalsRouter.put("/:category/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)
hospitalsRouter.delete("/:category/id/:id", jwtAuth, deleteAdvertisement)

hospitalsRouter.get("/:category/id/:id", getAdvertisement)
// images
//id =>advertisement id
hospitalsRouter.delete("/:category/image/delete/:id", jwtAuth, deleteImage)

hospitalsRouter.post("/:category/images/:id", jwtAuth, fileUpload("images").array("images"), editImagesValidator, addImage)
// list user own advertisement //id => user id
hospitalsRouter.get("/:category/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
hospitalsRouter.get("/:category/list", getListAdvertisement)



export default hospitalsRouter