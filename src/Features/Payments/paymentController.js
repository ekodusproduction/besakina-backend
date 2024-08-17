import Payment from "./paymentModel.js"
import { sendResponse, sendError } from "../../Utility/response.js"
import User from "../Users/Models/UserModel.js"

export const addPayments = async function (req, res, next) {
    try {
        console.log("req ", req.body);
        const payment = new Payment(req.body);
        await payment.save();
        await User.updateOne(
            { mobile: req.body.phone },
            { $push: { payments: payment._id } }
        );
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getPayments = async function (req, res, next) {
    try {
        const payments = await User.findById(req.user).select("payments").populate()
        return await sendResponse(res, "Payments history", 200, payments)
    } catch {
        next(error)
    }
}