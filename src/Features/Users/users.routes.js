import { Router } from "express";
import { loginValidation, mobileValidation } from "./users.validator.js";
import { login, sendOtp, getUsers, userDetails, getUserAdds } from "./users.controller.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
import { fileUpload } from "../../Middlewares/multer.middlewares.js";
const userRouter = Router()

userRouter.get("/", jwtAuth, getUsers)

userRouter.post("/login", loginValidation, login)
userRouter.post("/sendotp", mobileValidation, sendOtp)
userRouter.post("/details", jwtAuth, fileUpload("users"), userDetails)
userRouter.get("/myads", jwtAuth, getUserAdds)

export default userRouter  