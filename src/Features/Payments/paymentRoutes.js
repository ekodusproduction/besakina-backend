import { Router } from "express";
import { getPayments } from "./paymentController.js"
import {addPayments, failedPayments, disputePayments, refundPayments} from "./paymentHooks.js"
import {  verifyRequestOrigin } from "./verifyIpMiddleware.js"
import { jwtAuth } from "../../Middlewares/auth.middleware.js";

const paymentRouter = Router()

paymentRouter.post("/webhook", verifyRequestOrigin, addPayments)
paymentRouter.get("/all", jwtAuth, getPayments)

export default paymentRouter