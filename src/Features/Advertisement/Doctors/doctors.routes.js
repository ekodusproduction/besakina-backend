import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement
} from "./doctor.controller.js"
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./doctor.validations.js";
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";

const doctorRouter = Router()
//protected routes id=> advertisement id
doctorRouter.post("/add", jwtAuth, fileUpload("doctors"), validationMiddlewarePost, addAdvertisement)
doctorRouter.get("/filter", filterAdvertisement)
doctorRouter.put("/id/:id", jwtAuth, updateAdvertisement)
doctorRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)
doctorRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)
doctorRouter.get("/id/:id", getAdvertisement)
// images 
//id =>advertisement id
doctorRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)
doctorRouter.post("/images/id/:id", jwtAuth, fileUpload("doctors"), imageValidator, addImage)
// list user own advertisement //id => user id
doctorRouter.get("/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
doctorRouter.get("/list", getListAdvertisement)
doctorRouter.delete("/id/:id",jwtAuth, deleteAdvertisement)

export default doctorRouter