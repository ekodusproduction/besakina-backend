import { Router } from "express";
import { } from "./users.validator.js";
import { login, sendOtp } from "./users.controller.js";
const userRouter = Router()

userRouter.post("/login", loginValidaiton, login)
userRouter.post("/sendotp", mobileValidaiton, sendOtp)

export default userRouter  