import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement
} from "./hospitals.controller.js"
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./hospitals.validation.js";
const hospitalsRouter = Router()
//protected routes id=> advertisement id
hospitalsRouter.post("/add", jwtAuth, fileUpload("hospitals"), validationMiddlewarePost, addAdvertisement)

hospitalsRouter.get("/filter", filterAdvertisement)

hospitalsRouter.put("/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)

hospitalsRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)

hospitalsRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

hospitalsRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
hospitalsRouter.delete("/image/delete/id/:id", jwtAuth, deleteImage)

hospitalsRouter.post("/images/id/:id", jwtAuth, fileUpload("hospitals"), imageValidator, addImage)
// list user own advertisement //id => user id
hospitalsRouter.get("/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
hospitalsRouter.get("/list", getListAdvertisement)



export default hospitalsRouter