import { Router } from "express";
import { addPlan, deletePlan, getPlan } from "./plans.controller.js";
import { fileUpload } from "../../Middlewares/multer.middlewares.js";
import { addPlanValidator } from "./plans.validator.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
const plansRouter = Router()

plansRouter.post("/", jwtAuth, fileUpload('images').array('images'), addPlanValidator, addPlan)

plansRouter.get("/", getPlan)

plansRouter.delete("/id/:id", deletePlan)


export default plansRouter  