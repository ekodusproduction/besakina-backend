import { Router } from "express";
import {
    deactivateAdvertisement, updateAdvertisement, filterAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement, activateAdvertisement,
    deleteAdvertisement, addFormData,
    listFormData,
    editFormData,
    deleteFormData
} from "./property.controller.js"
import { requestBodyValidator } from "../../../Middlewares/validationMiddleware.js";
import { fileUpload } from "../../../Middlewares/multer.middlewares.js";
import { jwtAuth } from "../../../Middlewares/auth.middleware.js";
import { checkUserProfileCompletion, checkUserPlanQuotaPermissions } from "../../Users/userMiddlewares.js";

const propertyRouter = Router()

//protected routes id=> advertisement id
// propertyRouter.post("/", jwtAuth, checkPlanValidity, fileUpload("images").array("images"), validationMiddlewarePost, addAdvertisement)
propertyRouter.post("/add", jwtAuth, fileUpload("property"), checkUserProfileCompletion,  addAdvertisement)

propertyRouter.get("/filter", filterAdvertisement)

propertyRouter.get("/id/:id", getAdvertisement)
propertyRouter.put("/id/:id", jwtAuth, updateAdvertisement)

propertyRouter.put("/activate/id/:id", jwtAuth, activateAdvertisement)
propertyRouter.delete("/deactivate/id/:id", jwtAuth, deactivateAdvertisement)

//id =>advertisement id
propertyRouter.post("/images/id/:id", jwtAuth, fileUpload("property"), addImage)

propertyRouter.delete("/image/delete/id/:id", jwtAuth, requestBodyValidator, deleteImage)

// list user own advertisement //id => user id
propertyRouter.get("/list", getListAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
propertyRouter.delete("/id/:id", jwtAuth, deleteAdvertisement)

propertyRouter.get("/formdata/fieldname/:fieldname", listFormData)
propertyRouter.post("/formdata", jwtAuth, addFormData)
propertyRouter.put("/formdata/id/:id", jwtAuth, editFormData)
propertyRouter.delete("/formdata/:fieldname/id/:id", jwtAuth, deleteFormData)

export default propertyRouter