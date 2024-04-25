import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement
} from "./vehicles.controller.js"
import { checkPlanValidity } from "../../../Middlewares/checkValidPlan.middleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./vehicles.validation.js";
const vehiclesRouter = Router()

//protected routes id=> advertisement id
vehiclesRouter.post("/add", jwtAuth, fileUpload("vehicles"), validationMiddlewarePost, addAdvertisement)

vehiclesRouter.get("/filter", filterAdvertisement)

vehiclesRouter.put("/id/:id", jwtAuth, validationMiddlewarePut, updateAdvertisement)
vehiclesRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)

vehiclesRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

vehiclesRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
vehiclesRouter.delete("/image/delete/:id", jwtAuth, deleteImage)

vehiclesRouter.post("/images/:id", jwtAuth, fileUpload("images"), imageValidator, addImage)
// list user own advertisement //id => user id
vehiclesRouter.get("/list/self", jwtAuth, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
vehiclesRouter.get("/list", getListAdvertisement)



export default vehiclesRouter