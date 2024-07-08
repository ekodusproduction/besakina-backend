import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import https from 'https';
import http from 'http';
import { Server } from "socket.io";
import { asyncAdd, redisClient } from './redis.js';
import { jwtAuth } from './src/Middlewares/auth.middleware.js';
// import { chatSocket } from './src/Features/Chats/chat.socket.js';
import { socketAuth } from "./socketAuth.js"
import { s3Client } from './src/config/aws-sdk.js';
import fs from "fs";
import { connectToMongoDB } from './src/mongodb/mongodb.js';
import { mongooseConnection } from "./src/Mongoose/mongoose.js"
import { chatSocket } from './src/Features/Chats/chat.socket.js';

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    }
})

io.use(socketAuth)

io.on('connection', (socket) => {
    console.log('New client connected');
    chatSocket(socket);

    socket.on('disconnect', async () => {
        try {
            const user = socket.user;
            await redisClient.srem('onlineUsers', user.id);
            console.log(`User ${user.username} disconnected and removed from onlineUsers`);
        } catch (error) {
            console.error("Error handling disconnect:", error);
        }
    });
});

httpServer.listen(port, async () => {
    console.log(`HTTP server running on port ${port}`);
    await connectToMongoDB()
    await mongooseConnection()
});
