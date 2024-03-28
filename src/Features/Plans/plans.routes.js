import { Router } from "express";
import { addPlan, deletePlan, getPlan } from "./plans.controller.js";
import { fileUpload } from "../../Middlewares/multer.middlewares.js";
import { addPlanValidator } from "./plans.validator.js";
const plansRouter = Router()

plansRouter.post("/", fileUpload('images'), addPlanValidator, addPlan)
plansRouter.get("/", getPlan)
// plansRouter.put("/id/:id", deletePlan)
plansRouter.delete("/id/:id", deletePlan)


export default plansRouter  