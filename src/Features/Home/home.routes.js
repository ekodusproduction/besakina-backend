import { Router } from "express";
import { latestAdds } from "./home.controller.js";
const homeRouter = Router()

homeRouter.get("/latest", latestAdds)

export default homeRouter