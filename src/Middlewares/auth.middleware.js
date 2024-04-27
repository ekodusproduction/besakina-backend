import dotenv from "dotenv"
dotenv.config();
import jwt, { decode } from 'jsonwebtoken';
import { sendError } from "../Utility/response.js";

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            isValid: true,
            decoded: decoded
        };
    } catch (error) {
        return {
            isValid: false,
            error: error.message
        };
    }
};

export const jwtAuth = (req, res, next) => {
    // Extract the token from the request headers
    const token = req.headers.authorization;
    console.log("received in jwt");
    if (!token) {
        return sendError(res, 'No token provided. Please login', 401);
    }

    const { isValid, decoded, error } = verifyToken(token.split(" ")[1]);
    if (isValid) {
        // If token is valid, attach user information to the request object
        console.log("decoded", decoded);
        req.user_id = decoded.userId;
        req.plan_id = decoded.plan_id;
        next();
    } else {
        // If token is invalid or expired, send an error response
        return sendError(res, `Invalid token. ${error}`, 401);
    }
};
