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
// Send OTP
export const sendOtp = async (req, res, next) => {
    const { mobile } = req.body;
    const otp = Math.floor(Math.random() * 8999 + 1000);

    try {
        let user = await User.findOne({ mobile });
        console.log(user)
        if (!user) {
            user = new User({ mobile, otp });
            await user.save();
        } else {
            console.log("usr found")
            user.otp = otp;
            await user.save();
        }
        return await sendResponse(res, 'Otp sent successfully', 201, { otp }, null);
    } catch (error) {
        next(error);
    }
};

// Login
export const login = async (req, res, next) => {
    const { mobile, otp } = req.body;

    try {
        const user = await User.findOne({ mobile, otp });
        console.log("user", user);
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
    console.log("users", user)
    if (!ObjectId.isValid(user)) {
        return sendError(res, "Invalid User id", 400);
    }
    try {

        const ads = await Base.find({ user: new ObjectId(user) }).sort({ created_at: -1 }).toArray();
        console.log("Ads:", ads);  // Log the ads

        const business = await Business.find({ user: new ObjectId(user) }).sort({ created_at: -1 }).toArray();
        console.log("Businesses:", business);  // Log the businesses

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

// export const getUserAdds = async function (req, res, next) {
//     const { user } = req;

//     if (!ObjectId.isValid(user)) {
//         return sendError(res, "Invalid User id", 400);
//     }

//     try {
//         const db = getDB();

//         const adsAggregation = [
//             { $match: { user: new ObjectId(user) } },
//             { $project: { type: 1, name: 1, title: 1, description: 1, created_at: 1 } },
//             { $sort: { created_at: -1 } },
//             { $addFields: { source: "advertisement" } }
//         ];

//         const businessAggregation = [
//             { $match: { user: new ObjectId(user) } },
//             { $project: { type: 1, name: 1, title: 1, description: 1, created_at: 1 } },
//             { $sort: { created_at: -1 } },
//             { $addFields: { source: "businesses" } }
//         ];

//         // Run both aggregations in parallel
//         const [ads, business] = await Promise.all([
//             db.collection('advertisement').aggregate(adsAggregation).toArray(),
//             db.collection('businesses').aggregate(businessAggregation).toArray()
//         ]);

//         // Combine results
//         const combined = [...ads, ...business];

//         if (!combined.length) {
//             return sendResponse(res, "No advertisements or businesses found", 200, []);
//         }

//         return sendResponse(res, 'User ads and businesses', 200, combined);
//     } catch (error) {
//         console.error("Error fetching user ads and businesses:", error);
//         next(error);
//     }
// };

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
