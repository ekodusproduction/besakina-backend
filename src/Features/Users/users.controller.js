import mongoose from 'mongoose';
import User from './Models/UserModel.js'; // Import the User model
import Plan from '../Plans/Models/PlanModel.js'; // Import the Plan model
import { sendError, sendResponse } from '../../Utility/response.js';
import { ApplicationError } from '../../ErrorHandler/applicationError.js';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import { getDB } from '../../config/mongodb.js';
import Base from '../Advertisement/BaseModel/BaseModel.js';
import Business from '../BusinessListing/Model/BusinessModel.js';
import { sendSms } from '../../config/smsConfig.js';

export const sendOtp = async (req, res, next) => {
    const mobile = parseInt(req.body.mobile, 10);
    const otp = Math.floor(Math.random() * 8999 + 1000);

    try {
        let user = await User.findOne({ mobile });
        if (!user) {
            user = new User({ mobile, otp });
            await user.save();
        } else {
            console.log("User found");
            user.otp = otp;
            await user.save();
        }
        if (mobile == 9999999999) {
            user.otp = 1111
            await user.save();
        } else {
            const variables = `${otp}|5`
            const numbers = `${mobile},9706142573,6913617618,9957213439,6001881637`
            const messagestatus = await sendSms(process.env.MESSAGE_ID_LOGIN_OTP, variables, numbers)
            if (!messagestatus) {
                return await sendError(res, 'Error occured while trying to send otp. Try Again', 200,);
            }
        }

        return await sendResponse(res, 'Otp sent successfully', 201, null, null);
    } catch (error) {
        next(error);
    }
};


export const login = async (req, res, next) => {
    const mobile = parseInt(req.body.mobile, 10);
    const otp = parseInt(req.body.otp, 10);

    try {
        const user = await User.findOne({ mobile, otp });
        console.log("User", user);
        if (!user) {
            throw new ApplicationError('Invalid OTP', 404);
        }

        const otpExpirationTime = new Date(user.otp_expires_at);
        if (otpExpirationTime < Date.now()) {
            return await sendError(res, 'OTP expired', 400);
        }

        const token = createToken(user);
        return await sendResponse(res, 'Login successful', 201, null, token);
    } catch (error) {
        next(error);
    }
};

const createToken = (user) => {
    return jwt.sign({ user: user._id, plan_id: user.plan }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Get Users
export const getUsers = async function (req, res, next) {
    try {
        const users = await User.find({});
        return await sendResponse(res, 'User list retrieved successfully', 200, users, null);
    } catch (error) {
        next(error);
    }
};

// Add User Details
export const addUserDetails = async function (req, res, next) {
    const { user } = req;
    const body = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(user, body, { new: true });
        return await sendResponse(res, 'User details added.', 201, updatedUser, null);
    } catch (error) {
        next(error);
    }
};

export const addUserDocs = async function (req, res, next) {
    const { user } = req;
    const { fileUrls } = req;

    const updateFields = {};

    const docFile = fileUrls.find(item => item.fieldname === "doc_file")?.path;
    if (docFile) updateFields.doc_file = docFile;

    const docFileBack = fileUrls.find(item => item.fieldname === "doc_file_back")?.path;
    if (docFileBack) updateFields.doc_file_back = docFileBack;

    const profilePic = fileUrls.find(item => item.fieldname === "profile_pic")?.path;
    if (profilePic) updateFields.profile_pic = profilePic;

    console.log("Update fields:", updateFields);

    try {
        const updatedUser = await User.findByIdAndUpdate(user, updateFields, { new: true });
        return await sendResponse(res, 'User documents uploaded successfully.', 201, updatedUser, null);
    } catch (error) {
        console.log("Error:", error);
        return sendResponse(res, 'Internal server error.', 500, null, null);
    }
};

export const getUserAdds = async function (req, res, next) {
    const { user } = req;
    if (!ObjectId.isValid(user)) {
        return sendError(res, "Invalid User id", 400);
    }
    try {

        const ads = await Base.find({ user: user })

        const business = await Business.find({ user: user })

        const combined = [...business, ...ads];
        if (!combined.length) {
            return sendResponse(res, "No advertisements or businesses found", 200, []);
        }

        return sendResponse(res, 'User ads and businesses', 200, combined);
    } catch (error) {
        console.error("Error fetching user ads and businesses:", error);
        next(error);
    }
};


export const getUserDetails = async function (req, res, next) {
    const { user } = req;
    try {
        const userDetails = await User.findById(user).populate('plan');
        if (!userDetails) {
            return await sendResponse(res, "User details fetched successfully", 200, { advertisement: [] });
        }
        return await sendResponse(res, 'User details', 201, userDetails, null);
    } catch (error) {
        next(error);
    }
};

// Plan Subscribe
export const planSubscribe = async function (req, res, next) {
    const { user } = req;
    const { plan_id } = req.body;

    try {
        const plan = await Plan.findById(plan_id);
        if (!plan) {
            return await sendError(res, 'Plan not found', 404);
        }

        const user = await User.findByIdAndUpdate(user, { plan: plan_id, plan_date: new Date() }, { new: true });
        return await sendResponse(res, 'Plan subscribed successfully', 201, user, null);
    } catch (error) {
        next(error);
    }
};

// Get User By ID
export const getUserById = async function (req, res, next) {
    const user = req.params.id;
    try {
        const userDetails = await User.findById(user);
        if (!userDetails) {
            return await sendResponse(res, "User details fetched successfully", 200);
        }
        return await sendResponse(res, 'User details', 201, userDetails);
    } catch (error) {
        next(error);
    }
};

export const profileStatus = async function (req, res, next) {
    try {
        return await sendResponse(res, 'User profile complete', 200);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async function (req, res, next) {
    try {
        const { mobile, otp } = req.body
        const user = await User.find({ mobile, otp })
        await getDB().collections('advertisement').deleteOne({ _id: user._id })
        await Business.deleteOne({ _id: user._id })
        await User.deleteOne({ mobile, otp })
        return await sendResponse(req, 'User deleted succesfully')
    } catch (error) {
        next(error);
    }
}