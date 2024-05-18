import jwt from "jsonwebtoken";
import dotenv, { parse } from 'dotenv';
import pool from "../../Mysql/mysql.database.js";
import { sendError, sendResponse } from "../../Utility/response.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { getAllPosts, getUserAndPlan, getUserMobileById } from "./sql.js";
import { insertQuery, selectQuery, updateQuery } from "../../Utility/sqlQuery.js";
dotenv.config();

const parseImages = async (advertisements) => {
    return advertisements.map(advertisement => {
        advertisement.images = JSON.parse(advertisement?.images);
        advertisement.images = advertisement?.images?.map(photo => photo?.replace(/\\/g, '/'));
        return advertisement;
    });
};

export const sendOtp = async (req, res, next) => {
    const { mobile } = req.body;
    const otp = Math.floor(Math.random() * 8999 + 1000);
    let connection = await pool.getConnection();
    try {
        const [query, values] = await selectQuery("users", [], { "mobile": mobile })
        const [user] = await connection.query(query, values)
        if (user.length === 0) {
            const [insert, insertValues] = await insertQuery("users", { mobile, otp })
            await connection.query(insert, insertValues);
        } else {
            const [update, updateValues] = await updateQuery("users", { otp }, { id: user[0].id })
            await connection.query(update, updateValues)
        }
        return await sendResponse(res, 'Otp sent successfully', 201, { otp }, null);
    } catch (error) {
        next(error);
    } finally {
        connection.release(); // Release the connection back to the connection.query
    }
}

export const login = async (req, res, next) => {
    const { mobile, otp } = req.body;
    let connection = await pool.getConnection();

    try {
        const [query, values] = await selectQuery("users", [], { "mobile": mobile, "otp": otp })
        const [user, fields] = await connection.query(query, values);

        if (user.length == 0) {
            throw new ApplicationError('Invalid Otp', 404);
        }

        const fiveMin = 5 * 60 * 1000;
        const updatedAtDate = new Date(user[0].updated_at);

        if (Date.now() < updatedAtDate.getTime() + fiveMin) {
            const token = createToken(user[0]);
            return await sendResponse(res, 'Login successful', 201, null, token);
        } else {
            return await sendError(res, 'OTP expired', 400);
        }
    } catch (error) {
        next(error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}

const createToken = (user) => {
    return jwt.sign({ userId: user.id, plan_id: user.plan_id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

export const getUsers = async function (req, res, next) {
    let connection = await pool.getConnection();
    try {
        const [query, values] = await selectQuery("users", [], {})
        const [users, fields] = await connection.query(query, values);
        return await sendResponse(res, 'Login successful', 201, users, null);
    } catch (error) {
        next(error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}

export const addUserDetails = async function (req, res, next) {
    const { user_id } = req;
    const { body: requestBody } = req;
    let connection = await pool.getConnection();
    try {
        const [update, updateValues] = await updateQuery("users", requestBody, { id: req.user_id })
        console.log("update", update)
        console.log("updateValues", updateValues)
        const [updatedUser, field] = await connection.query(update, updateValues)

        return await sendResponse(res, 'User details added.', 201, updatedUser, null);
    } catch (error) {
        next(error)
    } finally {
        connection.release();
    }
}

export const addUserDocs = async function (req, res, next) {
    const { user_id } = req;
    const { fileUrls } = req;

    // Extract file paths for each type of document or set them to null if not found
    const docFile = fileUrls.find(item => item.fieldname === "doc_file")?.path || null;
    const docFileBack = fileUrls.find(item => item.fieldname === "doc_file_back")?.path || null;
    const profilePic = fileUrls.find(item => item.fieldname === "profile_pic")?.path || null;

    let connection;
    try {
        connection = await pool.getConnection();

        const updateQuery = `UPDATE users SET doc_file = ?, profile_pic = ?, doc_file_back = ? WHERE id = ?`;
        const updateValues = [docFile, profilePic, docFileBack, user_id];

        await connection.query(updateQuery, updateValues);

        return sendResponse(res, 'User documents uploaded successfully.', 201, null, null);
    } catch (error) {
        console.log("Error:", error);
        return sendResponse(res, 'Internal server error.', 500, null, null);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}



export const getUserAdds = async function (req, res, next) {
    const { user_id } = req;
    let connection = await pool.getConnection();

    try {
        const sql = getAllPosts.replaceAll('?', user_id)
        const [rows, fields] = await connection.query(sql);
        if (rows.length == 0) {
            return await sendResponse(res, "Advertisement fetched successfully", 200, []);
        }

        const data = await parseImages(rows)
        return await sendResponse(res, 'User adds', 200, data, null);
    } catch (error) {
        next(error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}

export const getUserDetails = async function (req, res, next) {
    const { user_id } = req;
    let connection = await pool.getConnection();

    try {
        const [userDetails, fields] = await pool.query(getUserAndPlan, [user_id]);

        if (userDetails.length === 0) {
            return await sendResponse(res, "Advertisement fetched successfully", 200, { advertisement: [] });
        }
        userDetails[0].plan = JSON.parse(userDetails[0].plan);

        return await sendResponse(res, 'User details', 201, userDetails[0], null);
    } catch (error) {
        next(error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}

export const planSubscribe = async function (req, res, next) {
    const { user_id } = req;
    let connection = await pool.getConnection();

    try {
        const [userDetails, fields] = await pool.query(getUserAndPlan, [user_id]);

        if (userDetails.length === 0) {
            return await sendResponse(res, "Advertisement fetched successfully", 200, { advertisement: [] });
        }
        userDetails[0].plan = JSON.parse(userDetails[0].plan);

        return await sendResponse(res, 'User details', 201, userDetails[0], null);
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
}

export const getUserById = async function (req, res, next) {
    const user_id = req.params.id;
    let connection = await pool.getConnection();
    try {
        const [userDetails, fields] = await pool.query(getUserMobileById, [user_id]);

        if (userDetails.length === 0) {
            return await sendResponse(res, "Advertisement fetched successfully", 200);
        }

        return await sendResponse(res, 'User details', 201, userDetails[0]);
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
}
