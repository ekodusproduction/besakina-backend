import { verifyToken } from "./src/Middlewares/auth.middleware.js"; // Assuming jwtUtils.js contains the verifyToken function

export const socketAuth = async function (socket, next) {
    try {
        const token = socket.handshake.query.token || socket.handshake.headers.authorization;

        if (!token) {
            throw new Error("No token provided. Please provide a valid token.");
        }

        const { isValid, decoded, error } = verifyToken(token.split(" ")[1]);

        if (isValid) {
            socket.user = decoded.userId;
            socket.plan_id = decoded.plan_id;
            next();
        } else {
            throw new Error(`Invalid token. ${error}`);
        }
    } catch (error) {
        next(error);
    }
};
