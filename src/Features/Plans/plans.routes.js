import { Router } from "express";
import { } from "./users.validator.js";
import { login, sendOtp } from "./users.controller.js";
import { addPlan, deletePlan, getPlan } from "./plans.controller.js";
const plansRouter = Router()

plansRouter.post("/", addPlan)
plansRouter.get("/",  getPlan)
plansRouter.put("/id/:id", deletePlan )
plansRouter.delete("/id/:id", deletePlan)


export default plansRouter  