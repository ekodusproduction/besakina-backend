import { Router } from "express";
import { loginValidation, mobileValidation } from "./users.validator.js";
import { login, sendOtp, getUsers, addUserDetails, getUserAdds, getUserDetails, getUserById } from "./users.controller.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
import { fileUpload } from "../../Middlewares/multer.middlewares.js";
const userRouter = Router()

userRouter.get("/", jwtAuth, getUsers)
userRouter.post("/login", loginValidation, login)
userRouter.post("/sendotp", mobileValidation, sendOtp)
userRouter.post("/detail", jwtAuth, fileUpload("users"), addUserDetails)
userRouter.get("/details", jwtAuth, getUserDetails)
userRouter.get("/myads", jwtAuth, getUserAdds)
userRouter.get("/id/:id", jwtAuth, getUserById)



export default userRouter  