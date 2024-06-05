import { Router } from "express";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
import { getBanner, addBanner, editBanner, deleteBanner } from "./banner.controller.js"

const bannerRouter = Router()

bannerRouter.get("/", getBanner)
bannerRouter.post("/", jwtAuth, addBanner)
bannerRouter.put("/", jwtAuth, editBanner)
bannerRouter.delete("/", jwtAuth, deleteBanner)

export default bannerRouter