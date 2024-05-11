import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from 'http';
import { Server } from "socket.io";
import { redisClient } from './redis.js';
// import { initializeSocketIO } from './socket.js';
import { jwtAuth } from './src/Middlewares/auth.middleware.js';
// import { socket } from './socket.js';
import { chatSocket } from './src/Features/Chats/chat.socket.js';
import { socketAuth } from "./socketAuth.js"
import { s3Client } from './src/config/aws-sdk.js';


const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
