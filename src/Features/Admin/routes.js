import { Router } from "express";
import { businessInfo, advertisementInfo } from "./controller.js";
const adminRouter = Router()

adminRouter.get("/advertisement/info", advertisementInfo)
adminRouter.get("/business/info", businessInfo)


export default adminRouter  