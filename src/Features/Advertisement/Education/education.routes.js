import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement
} from "./education.controller.js"

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./education.validation.js";
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";
const educationRouter = Router()

//protected routes id=> advertisement id
educationRouter.post("/", jwtAuth, checkPlanValidity,fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)

educationRouter.get("/filter", filterAdvertisement)

educationRouter.put("/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)
educationRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)

educationRouter.delete("/deactivate/id/:id", jwtAuth, deleteAdvertisement)

educationRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
educationRouter.delete("/image/delete/:id", jwtAuth, deleteImage)

educationRouter.post("/images/:id", jwtAuth, fileUpload("images").array("images"), imageValidator, addImage)
// list user own advertisement //id => user id
educationRouter.get("/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
educationRouter.get("/list", getListAdvertisement)



export default educationRouter