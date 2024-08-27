import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement, addFormData,
    listFormData,
    editFormData,
    deleteFormData
} from "./business.controller.js"

import { jwtAuth } from "../../Middlewares/auth.middleware.js";
import { checkUserProfileCompletion, checkUserPlanQuotaPermissions } from "../Users/userMiddlewares.js";
import { fileUpload } from "../../Middlewares/multer.middlewares.js";

let businessRouter = Router()
businessRouter.post("/add", jwtAuth, fileUpload("vehicles"), checkUserProfileCompletion,  addAdvertisement)
businessRouter.get("/filter", filterAdvertisement)
businessRouter.put("/id/:id", jwtAuth, updateAdvertisement)
businessRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)
businessRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)
businessRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
businessRouter.delete("/image/delete/id/:id", jwtAuth, deleteImage)
businessRouter.post("/images/id/:id", jwtAuth, fileUpload("vehicles"), addImage)
// list user own advertisement //id => user id
//category => doctors, education, hospitals, hospitality, vehicles, properties
businessRouter.get("/list", getListAdvertisement)
businessRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)
businessRouter.get("/formdata/fieldname/:fieldname", listFormData)
businessRouter.post("/formdata", jwtAuth, addFormData)
businessRouter.put("/formdata/id/:id", jwtAuth, editFormData)
businessRouter.delete("/formdata/:fieldname/id/:id", jwtAuth, deleteFormData)

export default businessRouter