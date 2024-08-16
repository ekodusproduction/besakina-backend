import { Router } from "express";
import { getPayments, addPayments } from "./paymentController.js"
import { verifyIp, verifyRequestOrigin } from "./verifyIpMiddleware.js"
import { jwtAuth } from "../../Middlewares/auth.middleware.js";

const paymentRouter = Router()

paymentRouter.post("/webhook", verifyRequestOrigin, addPayments)
paymentRouter.get("/all", jwtAuth, getPayments)

export default paymentRouter