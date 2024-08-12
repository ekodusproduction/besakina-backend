import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement,
    addEducationFormData,
    listEducationFormData,
    editEducationFormData,
    deleteEducationFormData
} from "./education.controller.js"
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";

import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";

import { checkUserProfileCompletion, checkUserPlanQuotaPermissions } from "../../Users/userMiddlewares.js";


const educationRouter = Router()

//protected routes id=> advertisement id
educationRouter.post("/add", jwtAuth, fileUpload("education"), checkUserProfileCompletion,  addAdvertisement)

educationRouter.get("/filter", filterAdvertisement)

educationRouter.put("/id/:id", jwtAuth, updateAdvertisement)
educationRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)
educationRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

educationRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

educationRouter.get("/id/:id", getAdvertisement)
// images
//id =>advertisement id
educationRouter.delete("/image/delete/id/:id", jwtAuth, deleteImage)

educationRouter.post("/images/id/:id", jwtAuth, fileUpload("education"), addImage)
//category => doctors, education, hospitals, hospitality, vehicles, properties
educationRouter.get("/list", getListAdvertisement)
educationRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)


educationRouter.get("/formdata/fieldname/:fieldname", listEducationFormData)
educationRouter.post("/formdata", jwtAuth, addEducationFormData)
educationRouter.put("/formdata/id/:id", jwtAuth, editEducationFormData)
educationRouter.delete("/formdata/:fieldname/id/:id", jwtAuth, deleteEducationFormData)

export default educationRouter