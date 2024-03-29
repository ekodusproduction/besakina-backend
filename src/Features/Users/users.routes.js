import { Router } from "express";
import { loginValidation, mobileValidation } from "./users.validator.js";
import { login, sendOtp } from "./users.controller.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
const userRouter = Router()

userRouter.post("/login", loginValidation, login)
userRouter.post("/sendotp", mobileValidation, sendOtp)
userRouter.get("/", jwtAuth, getUsers)

export default userRouter  