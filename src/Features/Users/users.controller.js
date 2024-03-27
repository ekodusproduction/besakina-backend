import jwt from "jsonwebtoken";
import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";

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
    const userId = String(result.id); // Convert BigInt to string

    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}