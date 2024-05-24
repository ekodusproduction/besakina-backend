import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement
} from "./hospitality.controller.js"

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";
import { checkUserProfileCompletion, checkUserPlanQuotaPermissions } from "../../Users/userMiddlewares.js";


const hospitalityRouter = Router()

//protected routes id=> advertisement id
hospitalityRouter.post("/add", jwtAuth, fileUpload("hospitality"), checkUserProfileCompletion, addAdvertisement)

hospitalityRouter.get("/filter", filterAdvertisement)

hospitalityRouter.put("/id/:id", jwtAuth, updateAdvertisement)
hospitalityRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)

hospitalityRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

hospitalityRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
hospitalityRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

hospitalityRouter.post("/images/id/:id", jwtAuth, fileUpload("hospitality"), addImage)
// list user own advertisement //id => user id
//category => doctors, education, hospitals, hospitality, vehicles, properties
hospitalityRouter.get("/list", getListAdvertisement)

hospitalityRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)

export default hospitalityRouter