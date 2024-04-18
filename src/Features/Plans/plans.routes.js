import { Router } from "express";
import { addPlan, deletePlan, getPlan } from "./plans.controller.js";
import { fileUpload } from "../../Middlewares/multer.middlewares.js";
import { addPlanValidator } from "./plans.validator.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
const plansRouter = Router()


plansRouter.get("/", getPlan)
plansRouter.post("/", jwtAuth, fileUpload('images'), addPlanValidator, addPlan)
plansRouter.delete("/id/:id", deletePlan)


export default plansRouter  