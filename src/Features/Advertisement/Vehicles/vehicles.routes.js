import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement, addFormData,
    listFormData,
    editFormData,
    deleteFormData
} from "./vehicles.controller.js"
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { checkUserProfileCompletion, checkUserPlanQuotaPermissions } from "../../Users/userMiddlewares.js";

const vehiclesRouter = Router()

//protected routes id=> advertisement id
vehiclesRouter.post("/add", jwtAuth, fileUpload("vehicles"), checkUserProfileCompletion, checkUserPlanQuotaPermissions, addAdvertisement)

vehiclesRouter.get("/filter", filterAdvertisement)

vehiclesRouter.put("/id/:id", jwtAuth, requestBodyValidator, updateAdvertisement)
vehiclesRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)
vehiclesRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

vehiclesRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
vehiclesRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

vehiclesRouter.post("/images/id/:id", jwtAuth, fileUpload("vehicles"), addImage)
// list user own advertisement //id => user id
//category => doctors, education, hospitals, hospitality, vehicles, properties
vehiclesRouter.get("/list", getListAdvertisement)
vehiclesRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)

vehiclesRouter.get("/formdata/fieldname/:fieldname", listFormData)
vehiclesRouter.post("/formdata", jwtAuth, addFormData)
vehiclesRouter.put("/formdata/id/:id", jwtAuth, editFormData)
vehiclesRouter.delete("/formdata/:fieldname/id/:id", jwtAuth, deleteFormData)

export default vehiclesRouter