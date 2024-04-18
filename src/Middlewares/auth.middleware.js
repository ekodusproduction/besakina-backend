import dotenv from "dotenv"
dotenv.config();
import jwt, { decode } from 'jsonwebtoken';
import { sendError } from "../Utility/response.js";
export const jwtAuth = function (req, res, next) {
    // Extract the token from the request headers
    const token = req.headers.authorization;

    if (!token) {
        return sendError(res, 'No token provided. Please login', 401);
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        // If token is valid, attach user information to the request object
        console.log(decoded)
        req.user_id = decoded.userId;
        req.plan_id = decoded.plan_id;

        next();
    } catch (error) {
        // If token is invalid or expired, send an error response
        return sendError(res, 'Invalid token. Please login again', 401);
    }
};
