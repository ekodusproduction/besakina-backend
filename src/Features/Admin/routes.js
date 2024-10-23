import { Router } from "express";
import { businessInfo, advertisementInfo } from "./controller.js";
const adminRouter = Router()

adminRouter.get("/advertisement/info", businessInfo)
adminRouter.get("/business/info", advertisementInfo)


export default adminRouter  