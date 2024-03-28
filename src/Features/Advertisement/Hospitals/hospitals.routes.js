import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement
} from "./hospitals.controller.js"
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./hospitals.validation.js";
const hospitalsRouter = Router()
//protected routes id=> advertisement id
hospitalsRouter.post("/", jwtAuth,checkPlanValidity, fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)

hospitalsRouter.get("/filter", filterAdvertisement)

hospitalsRouter.put("/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)

hospitalsRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)

hospitalsRouter.delete("/deactivate/id/:id", jwtAuth, deleteAdvertisement)

hospitalsRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
hospitalsRouter.delete("/image/delete/:id", jwtAuth, deleteImage)

hospitalsRouter.post("/images/:id", jwtAuth, fileUpload("images").array("images"), imageValidator, addImage)
// list user own advertisement //id => user id
hospitalsRouter.get("/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
hospitalsRouter.get("/list", getListAdvertisement)



export default hospitalsRouter