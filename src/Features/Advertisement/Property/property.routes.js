import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement, 
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement
} from "./property.controller.js"
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./property.validation.js";
const propertyRouter = Router()

//protected routes id=> advertisement id
// propertyRouter.post("/", jwtAuth, checkPlanValidity, fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)
propertyRouter.post("/add", jwtAuth, fileUpload("property"), addAdvertisement)

propertyRouter.get("/filter", filterAdvertisement)

propertyRouter.get("/id/:id", getAdvertisement)
propertyRouter.put("/id/:id", jwtAuth, updateAdvertisement)

propertyRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)
propertyRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)


// images
//id =>advertisement id
propertyRouter.post("/images/id/:id", jwtAuth, fileUpload("property"), imageValidator, addImage)


propertyRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

// list user own advertisement //id => user id
propertyRouter.get("/list", getListAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
propertyRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)


export default propertyRouter