import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { insertQuery } from "../../Utility/sqlQuery.js";

export const sendOtp = async (req, res, next) => {
    const { mobile } = req.body;
    const otp = Math.floor(Math.random() * 8999 + 1000);
    const connection = await pool.getConnection();
    try {
        const checkQuery = 'SELECT id FROM users WHERE mobile = ?';
        const [rows, fields] = await connection.query(checkQuery, [mobile]);
        if (rows.length > 0) {
            const updateQuery = 'UPDATE users SET otp = ? WHERE mobile = ?';
            await connection.query(updateQuery, [otp, mobile]);
        } else {
            const insertQuery = 'INSERT INTO users (mobile, otp) VALUES (?, ?)';
            await connection.query(insertQuery, [mobile, otp]);
        }
        return await sendResponse(res, 'Otp sent successfully', 201, { otp }, null);
    } catch (error) {
        next(error);
        // return await sendError(res, 'OTP expired', 400);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export const login = async (req, res, next) => {
    const connection = await pool.getConnection();

    try {
        const { mobile, otp } = req.body;
        const connection = await pool.getConnection();
        const selectQuery = 'SELECT * FROM users WHERE mobile = ?';
        const [rows] = await connection.query(selectQuery, [mobile]);

        if (rows.length === 0) {
            throw new ApplicationError('User not found for given mobile number', 404);
        }

        const user = rows[0];

        const updatedAtDate = new Date(user.updatedAt);
        const fiveMin = 5 * 60 * 60 * 1000;

        if (user.otp !== otp) {
            return await sendError(res, 'Invalid OTP', 400);
        }

        if (Date.now() < updatedAtDate.getTime() + fiveMin) {
            const token = createToken(user);
            return await sendResponse(res, 'Login successful', 201, null, token);
        } else {
            return await sendError(res, 'OTP expired', 400);
        }
    } catch (error) {
        console.error('Error in login:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


const createToken = (result) => {
    // Convert BigInt id to string or regular number before including it in the payload
    const userId = result.id; // Convert BigInt to string
    const plan_id = result.plan_id;
    console.log('plan_id', plan_id)
    return jwt.sign({ userId: userId, plan_id: plan_id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

export const getUsers = async function (req, res, next) {
    const connection = await pool.getConnection();

    try {
        const [users, userFields] = await connection.query('SELECT * FROM users')
        return await sendResponse(res, 'Login successful', 201, users, null);
    } catch (error) {
        console.error('Error in login:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


export const userDetails = async function (req, res, next) {
    const connection = await pool.getConnection();
    try {
        const requestBody = req.body;
        const profilePic = req.files.find(item => item.fieldname === "image");
        const docFile = req.files.find(item => item.fieldname === "doc_file");

        // Add profile_pic and doc_file paths to requestBody

        if (requestBody.docType == "aadhar") {
            requestBody.doc_file = docFile.path;
            const docFileBack = req.files.find(item => item.fieldname === "doc_file_back");
            requestBody.doc_file_back = docFileBack.path;
        }

        if (profilePic) {
            requestBody.profile_pic = profilePic.path;
        }
        // Construct the INSERT query
        const [query, values] = await insertQuery('users', requestBody);

        // Execute the query
        const [rows, fields] = await connection.query(query, values);

        return await sendResponse(res, 'User details added.', 201, rows.insertId, null);
    } catch (error) {
        console.error('Error in user details:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}