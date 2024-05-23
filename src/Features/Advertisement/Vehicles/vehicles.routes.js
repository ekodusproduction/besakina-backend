import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement
} from "./vehicles.controller.js"
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { validationMiddlewarePost, validationMiddlewarePut, imageValidator } from "./vehicles.validation.js";
import { checkUserProfileCompletion, checkUserPlanQuotaPermissions } from "../../Users/userMiddlewares.js";

const vehiclesRouter = Router()

//protected routes id=> advertisement id
vehiclesRouter.post("/add", jwtAuth, fileUpload("vehicles"), validationMiddlewarePost, checkUserProfileCompletion, addAdvertisement)

vehiclesRouter.get("/filter", filterAdvertisement)

vehiclesRouter.put("/id/:id", jwtAuth, requestBodyValidator, validationMiddlewarePut, updateAdvertisement)
vehiclesRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)
vehiclesRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

vehiclesRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
vehiclesRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

vehiclesRouter.post("/images/id/:id", jwtAuth, fileUpload("vehicles"), imageValidator, addImage)
// list user own advertisement //id => user id
//category => doctors, education, hospitals, hospitality, vehicles, properties
vehiclesRouter.get("/list", getListAdvertisement)
vehiclesRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)



export default vehiclesRouter