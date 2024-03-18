import pool from "../../Mysql/mysql.database.js";
import jwt from "jsonwebtoken";
import { sendError, sendResponse } from "../../Utility/response.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";


export const sendOtp = async (req, res, next) => {
    const { mobile } = req.body;
    const otp = Math.floor(Math.random() * 8999 + 1000);
    let connection;
    try {
        connection = await pool.getConnection();
        const checkQuery = 'SELECT id FROM users WHERE mobile = ?';
        const rows = await connection.query(checkQuery, [mobile]);
        console.log(rows)
        if (rows) {
            const updateQuery = 'UPDATE users SET otp = ? WHERE mobile = ?';
            await connection.query(updateQuery, [otp, mobile]);
        } else {
            const insertQuery = 'INSERT INTO users (mobile, otp) VALUES (?, ?)';
            await connection.query(insertQuery, [mobile, otp]);
        }

        await sendResponse(res, 'Otp sent successfully', 201, { otp }, null);

    } catch (error) {
        console.error('Error in sendOtp:', error);
        next(error);
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

export const login = async (req, res, next) => {
    const { mobile, otp } = req.body;

    try {
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
            await sendError(res, 'Invalid OTP', null, 400);
        }

        if (Date.now() < updatedAtDate.getTime() + fiveMin) {
            const token = await createToken(user);
            await sendResponse(res, 'Login successful', null, 201, token);
        } else {
            await sendError(res, 'OTP expired', null, 400);
        }
    } catch (error) {
        console.error('Error in login:', error);
        next(error);
    } finally {
        if (connection) {
            connection.end();
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