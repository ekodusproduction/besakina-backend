import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement
} from "./hospitals.controller.js"
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./hospitals.validation.js";
import { checkUserProfileCompletion, checkUserPlanQuotaPermissions } from "../../Users/userMiddlewares.js";

const hospitalsRouter = Router()
//protected routes id=> advertisement id
hospitalsRouter.post("/add", jwtAuth, fileUpload("hospitals"), validationMiddlewarePost, checkUserProfileCompletion, addAdvertisement)

hospitalsRouter.get("/filter", filterAdvertisement)

hospitalsRouter.put("/id/:id", jwtAuth, updateAdvertisement)

hospitalsRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)

hospitalsRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

hospitalsRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
hospitalsRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

hospitalsRouter.post("/images/id/:id", jwtAuth, fileUpload("hospitals"), imageValidator, addImage)
// list user own advertisement //id => user id
//category => doctors, education, hospitals, hospitality, vehicles, properties
hospitalsRouter.get("/list", getListAdvertisement)

hospitalsRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)

export default hospitalsRouter