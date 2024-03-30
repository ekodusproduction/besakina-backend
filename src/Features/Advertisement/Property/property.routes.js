import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement
} from "./property.controller.js"
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./property.validation.js";
const propertyRouter = Router()

//protected routes id=> advertisement id
// propertyRouter.post("/", jwtAuth, checkPlanValidity, fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)
propertyRouter.post("/", jwtAuth,fileUpload("images"), addAdvertisement)

propertyRouter.get("/filter", filterAdvertisement)

propertyRouter.put("/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)
propertyRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)

propertyRouter.delete("/deactivate/id/:id", jwtAuth, deleteAdvertisement)

propertyRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
propertyRouter.delete("/image/delete/:id", jwtAuth, deleteImage)

propertyRouter.post("/images/:id", jwtAuth, fileUpload("images"), imageValidator, addImage)
// list user own advertisement //id => user id
propertyRouter.get("/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
propertyRouter.get("/list", getListAdvertisement)



export default propertyRouter