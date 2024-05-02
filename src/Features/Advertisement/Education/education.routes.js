import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement
} from "./education.controller.js"
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./education.validation.js";
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";
const educationRouter = Router()

//protected routes id=> advertisement id
educationRouter.post("/add", jwtAuth, fileUpload("education"), validationMiddlewarePost, addAdvertisement)

educationRouter.get("/filter", filterAdvertisement)

educationRouter.put("/id/:id", jwtAuth, updateAdvertisement)
educationRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)
educationRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

educationRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

educationRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
educationRouter.delete("/image/delete/id/:id", jwtAuth, deleteImage)

educationRouter.post("/images/id/:id", jwtAuth, fileUpload("education"), imageValidator, addImage)
//category => doctors, education, hospitals, hospitality, vehicles, properties
educationRouter.get("/list", getListAdvertisement)
educationRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)


export default educationRouter