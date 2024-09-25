import Payment from "./paymentModel.js"
import { sendResponse, sendError } from "../../Utility/response.js"
import User from "../Users/Models/UserModel.js"

import { getDB } from "../../config/mongodb.js";

import Plan from "../../models/plan.js"; 

export const addPayments = async function (req, res, next) {
    try {
        const db = getDB();
        const plan = await Plan.findOne({ _id: req.body.productInfo });

        if (!plan) {
            return res.status(200).send('No plan found');
        }
        const { merchantKey, orderId, paymentId, status, amount } = req.body;

        const planValidity = plan.validity || 0;
        const extraOfferValidity = plan.extra_offer_validity || 0;

        const totalValidityInMs = (planValidity + extraOfferValidity) * 24 * 60 * 60 * 1000;
        const planExpiryDate = new Date(Date.now() + totalValidityInMs);

        const paymentsCollection = db.collection('payments');
        const usersCollection = db.collection('users');

        const paymentResult = await paymentsCollection.insertOne(req.body);
        const new_payment_Id = paymentResult.insertedId;

        await usersCollection.updateOne(
            { mobile: req.body.phone },
            {
                $push: { payments: new_payment_Id },
                $set: { plan_expiry_date: planExpiryDate }
            }
        );

        res.status(201).json({ success: true, paymentId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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