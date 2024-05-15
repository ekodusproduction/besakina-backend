import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import https from 'https';
import { Server } from "socket.io";
import { redisClient } from './redis.js';
// import { initializeSocketIO } from './socket.js';
import { jwtAuth } from './src/Middlewares/auth.middleware.js';
// import { socket } from './socket.js';
import { chatSocket } from './src/Features/Chats/chat.socket.js';
import { socketAuth } from "./socketAuth.js"
import { s3Client } from './src/config/aws-sdk.js';
import fs from "fs";

const port = process.env.PORT || 3000;

// Check if it's a production environment
if (process.env.NODE_ENV === 'production') {
    const privateKey = fs.readFileSync('./private.key', 'utf8');
    const certificate = fs.readFileSync('./certificate.pem', 'utf8');

    const credentials = { key: privateKey, cert: certificate };

    // Create HTTPS server with credentials
    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
} else {
    // Create HTTP server without credentials
    const httpServer = http.createServer(app);

    httpServer.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}