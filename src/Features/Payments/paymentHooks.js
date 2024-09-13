import Payment from "./paymentModel.js"
import { sendResponse, sendError } from "../../Utility/response.js"
import User from "../Users/Models/UserModel.js"


export const addPayments = async function (req, res, next) {
    try {
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

export const failedPayments = async function (req, res, next) {
    try {
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

export const refundPayments = async function (req, res, next) {
    try {
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

export const disputePayments = async function (req, res, next) {
    try {
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