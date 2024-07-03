import { verifyToken } from "./src/Middlewares/auth.middleware.js"; // Assuming jwtUtils.js contains the verifyToken function

export const socketAuth = async function (socket, next) {
    try {
        const token = socket.handshake.headers.token || socket.handshake.headers.authorization;
        console.log("token", token)

        if (!token) {
            throw new Error("No token provided. Please provide a valid token.");
        }

        const { isValid, decoded, error } = verifyToken(token);
        if (isValid) {
            next();
        } else {
            throw new Error(`Invalid token. ${error}`);
        }
    } catch (error) {
        next(error);
    }
};
