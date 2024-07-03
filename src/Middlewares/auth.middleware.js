import dotenv from "dotenv"
dotenv.config();
import jwt, { decode } from 'jsonwebtoken';
import { sendError } from "../Utility/response.js";
export const verifyToken = (token) => {
    try {
        console.log("token", token)
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

export const jwtAuth = async (req, res, next) => {
    // Extract the token from the request headers
    const token = req.headers.authorization;
    if (!token) {
        return await sendError(res, 'No token provided. Please login', 401);
    }

    const { isValid, decoded, error } = verifyToken(token.split(" ")[1]);
    if (isValid) {
        // If token is valid, attach user information to the request object
        req.user = decoded.user;
        console.log(req.user)
        req.plan_id = decoded.plan_id;
        next();
    } else {
        // If token is invalid or expired, send an error response
        return await sendError(res, `Invalid token. ${error}`, 401);
    }
};
