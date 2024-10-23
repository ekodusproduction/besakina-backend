import { Router } from "express";
import { businessInfo, advertisementInfo } from "./controller";
const adminRouter = Router()

adminRouter.get("/admin/advertisement/info", businessInfo)
adminRouter.get("/admin/business/info", advertisementInfo)


export default adminRouter  