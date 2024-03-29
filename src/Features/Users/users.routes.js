import { Router } from "express";
import { loginValidation, mobileValidation } from "./users.validator.js";
import { login, sendOtp ,getUsers} from "./users.controller.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
const userRouter = Router()

userRouter.get("/", jwtAuth, getUsers)

userRouter.post("/login", loginValidation, login)
userRouter.post("/sendotp", mobileValidation, sendOtp)

export default userRouter  