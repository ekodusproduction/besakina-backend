import { Router } from "express";
import { businessInfo, advertisementInfo } from "./controller.js";
const adminRouter = Router()

adminRouter.get("/admin/advertisement/info", businessInfo)
adminRouter.get("/admin/business/info", advertisementInfo)


export default adminRouter  