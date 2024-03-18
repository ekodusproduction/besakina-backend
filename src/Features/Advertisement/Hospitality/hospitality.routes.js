import { Router } from "express";
import {
    deleteAdvertisement, updateAdvertisement, filterAdvertisement, listUserAdvertisement,
    getListAdvertisement, addAdvertisement, addImage, deleteImage, getAdvertisement
} from "./advertisement.controller.js"
import { fileUpload } from "../../Middlewares/multer.middleware.js"
import { validationMiddleware, editImagesValidator, validateCategory } from "./advertisement.validator.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
const addRouter = Router()



//protected routes id=> advertisement id
addRouter.post("/category/:category", jwtAuth, validateCategory, fileUpload("images").array("images"), validationMiddleware, addAdvertisement)

addRouter.get("/category/:category/filter", validateCategory, filterAdvertisement)

addRouter.put("/category/:category/id/:id", jwtAuth, validateCategory, validationMiddleware, updateAdvertisement)
addRouter.delete("/category/:category/id/:id", jwtAuth, deleteAdvertisement)

addRouter.get("/category/:category/id/:id", getAdvertisement)
// images
//id =>advertisement id
addRouter.delete("/category/:category/image/delete/:id", jwtAuth, validateCategory, deleteImage)

addRouter.post("/category/:category/images/:id", jwtAuth, validateCategory, fileUpload("images").array("images"), editImagesValidator, addImage)
// list user own advertisement //id => user id
addRouter.get("/category/:category/list/self", jwtAuth, validateCategory, listUserAdvertisement)
//category => doctors, education, hospitals, hospitality, vehicles, properties
addRouter.get("/category/:category/list", validateCategory, getListAdvertisement)



export default addRouter