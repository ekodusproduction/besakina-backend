import jwt from "jsonwebtoken";
import dotenv, { parse } from 'dotenv';
import db from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { getAllPosts, getUserAndPlan } from "./sql.js";
dotenv.config();

const parseImages = async (advertisements) => {
    return advertisements.map(advertisement => {
        advertisement.images = JSON.parse(advertisement.images);
        advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
        return advertisement;
    });
};

export const sendOtp = async (req, res, next) => {
    const { mobile } = req.body;
    const otp = Math.floor(Math.random() * 8999 + 1000);

    try {
        const user = await db('users').where('mobile', mobile).first();

        if (user) {
            await db('users').where('mobile', mobile).update({ otp });
        } else {
            await db('users').insert({ mobile, otp });
        }

        return sendResponse(res, 'Otp sent successfully', 201, { otp }, null);
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    const { mobile, otp } = req.body;

    try {
        const user = await db('users').where('mobile', mobile).first();

        if (!user) {
            throw new ApplicationError('User not found for given mobile number', 404);
        }

        if (user.otp !== otp) {
            return sendError(res, 'Invalid OTP', 400);
        }

        const fiveMin = 5 * 60 * 1000;
        const updatedAtDate = new Date(user.updatedAt);

        if (Date.now() < updatedAtDate.getTime() + fiveMin) {
            const token = createToken(user);
            return sendResponse(res, 'Login successful', 201, null, token);
        } else {
            return sendError(res, 'OTP expired', 400);
        }
    } catch (error) {
        next(error);
    }
}

const createToken = (user) => {
    return jwt.sign({ userId: user.id, plan_id: user.plan_id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

export const getUsers = async function (req, res, next) {
    try {
        const users = await db('users').select('*');
        return sendResponse(res, 'Login successful', 201, users, null);
    } catch (error) {
        next(error);
    }
}

export const addUserDetails = async function (req, res, next) {
    const { user_id } = req;
    const { body: requestBody, files } = req;

    try {
        const profilePic = files.find(item => item.fieldname === "profile_pic")?.path;
        const docFile = files.find(item => item.fieldname === "doc_file")?.path;
        const docFileBack = files.find(item => item.fieldname === "doc_file_back")?.path;

        requestBody.profile_pic = profilePic || null;
        requestBody.doc_file = docFile || null;
        requestBody.doc_file_back = docFileBack || null;

        const updatedUser = await db('users').where('id', user_id).update(requestBody);

        return sendResponse(res, 'User details added.', 201, updatedUser.insertId, null);
    } catch (error) {

        next(error);
    }
}

export const getUserAdds = async function (req, res, next) {
    const { user_id } = req;

    try {
        const [rows, fields] = await db.raw(getAllPosts.replaceAll('?', user_id));
        console.log("ads", rows)
        if (rows == undefined) {
            return sendResponse(res, "Advertisement fetched successfully", 200, { advertisement: [] });
        }

        const data = await parseImages(rows)
        return sendResponse(res, 'User adds', 200, data, null);
    } catch (error) {
        next(error);
    }
}

export const getUserDetails = async function (req, res, next) {
    const { user_id } = req;

    try {
        const [userDetails, fields] = await db.raw(getUserAndPlan, [user_id]);

        if (userDetails.length === 0) {
            return sendResponse(res, "Advertisement fetched successfully", 200, { advertisement: [] });
        }
        console.log(userDetails)
        userDetails[0].plan = JSON.parse(userDetails[0].plan);

        return sendResponse(res, 'User details', 201, userDetails[0], null);
    } catch (error) {
        next(error);
    }
}
