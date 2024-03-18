import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement
} from "./vehicles.controller.js"
import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut } from "./vehicles.validation.js";
import { editImagesValidator } from "../../../Utility/editImagesValidator.js";

const vehiclesRouter = Router()
//protected routes id=> advertisement id
vehiclesRouter.post("/:category", jwtAuth, fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)
vehiclesRouter.get("/:category/filter", filterAdvertisement)
vehiclesRouter.put("/:category/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)
vehiclesRouter.delete("/:category/id/:id", jwtAuth, deleteAdvertisement)
vehiclesRouter.get("/:category/id/:id", getAdvertisement)
// images
//id =>advertisement id
vehiclesRouter.delete("/:category/image/delete/:id", jwtAuth, deleteImage)
vehiclesRouter.post("/:category/images/:id", jwtAuth, fileUpload("images").array("images"), editImagesValidator, addImage)
// list user own advertisement //id => user id
vehiclesRouter.get("/:category/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
vehiclesRouter.get("/:category/list", getListAdvertisement)

export default vehiclesRouter