import { Router } from "express";
import { businessInfo, advertisementInfo } from "./controller";
const userRouter = Router()

userRouter.get("/admin/advertisement/info", businessInfo)
userRouter.get("/admin/business/info", advertisementInfo)


export default userRouter  