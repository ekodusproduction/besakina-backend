import { Router } from "express";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
import bannerController from "./banner.controller.js"

const bannerRouter = Router()

bannerRouter.get("/", bannerController.getBanner)
bannerRouter.post("/", jwtAuth, bannerController.addBanner)
bannerRouter.put("/id/:id", jwtAuth, bannerController.editBanner)
bannerRouter.delete("/id/:id", jwtAuth, bannerController.deleteBanner)

export default bannerRouter