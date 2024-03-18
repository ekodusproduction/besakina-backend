import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement
} from "./doctor.validations.js"

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut } from "./doctor.validations.js";
import { editImagesValidator } from "../../../Utility/editImagesValidator.js";
const doctorsRouter = Router()

//protected routes id=> advertisement id
doctorsRouter.post("/:category", jwtAuth, fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)

doctorsRouter.get("/:category/filter", filterAdvertisement)

doctorsRouter.put("/:category/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)
doctorsRouter.delete("/:category/id/:id", jwtAuth, deleteAdvertisement)

doctorsRouter.get("/:category/id/:id", getAdvertisement)
// images
//id =>advertisement id
doctorsRouter.delete("/:category/image/delete/:id", jwtAuth, deleteImage)

doctorsRouter.post("/:category/images/:id", jwtAuth, fileUpload("images").array("images"), editImagesValidator, addImage)
// list user own advertisement //id => user id
doctorsRouter.get("/:category/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
doctorsRouter.get("/:category/list", getListAdvertisement)

export default doctorsRouter