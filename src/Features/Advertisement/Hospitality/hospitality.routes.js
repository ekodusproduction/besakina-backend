import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement
} from "./hospitality.controller.js"

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./hospitality.validation.js";
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";
const hospitalityRouter = Router()

//protected routes id=> advertisement id
hospitalityRouter.post("/add", jwtAuth, fileUpload("hospitality"), validationMiddlewarePost, addAdvertisement)

hospitalityRouter.get("/filter", filterAdvertisement)

hospitalityRouter.put("/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)
hospitalityRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)

hospitalityRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

hospitalityRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
hospitalityRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

hospitalityRouter.post("/images/id/:id", jwtAuth, fileUpload("hospitality"), imageValidator, addImage)
// list user own advertisement //id => user id
hospitalityRouter.get("/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
hospitalityRouter.get("/list", getListAdvertisement)

hospitalityRouter.delete("/id/:id", deleteAdvertisement)

export default hospitalityRouter