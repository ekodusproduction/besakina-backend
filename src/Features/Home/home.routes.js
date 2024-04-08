import { Router } from "express";
import { latestAdds, searchAdds } from "./home.controller.js";
const homeRouter = Router()

homeRouter.get("/latest", latestAdds)
homeRouter.get("/search", searchAdds)

export default homeRouter