import Payment from "./paymentModel.js"
import { sendResponse, sendError } from "../../Utility/response.js"
import User from "../Users/Models/UserModel.js"

export const getPayments = async function (req, res, next) {
    try {
        const user = await User.findById(req.user);
        const payments = await Payment.find({ phone: user.mobile }).select('amount txnid productinfo')
        return await sendResponse(res, "Payments history", 200, payments);
    } catch {
        next(error)
    }
}

