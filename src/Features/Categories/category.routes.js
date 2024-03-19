import { Router } from "express";
import { fileUpload } from "../../Middlewares/multer.middlewares.js";
import { createCategory, listCategory } from "./category.controller.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
// import { login, sendOtp } from "./users.controller.js";
const categoryRouter = Router()

categoryRouter.post("/", jwtAuth, fileUpload,createCategory)
categoryRouter.get("/", jwtAuth, listCategory)

export default categoryRouter  