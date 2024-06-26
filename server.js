import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import https from 'https';
import http from 'http';
import { Server } from "socket.io";
import { redisClient } from './redis.js';
import { jwtAuth } from './src/Middlewares/auth.middleware.js';
// import { chatSocket } from './src/Features/Chats/chat.socket.js';
import { socketAuth } from "./socketAuth.js"
import { s3Client } from './src/config/aws-sdk.js';
import fs from "fs";
import { connectToMongoDB } from './src/mongodb/mongodb.js';
import { mongooseConnection } from "./src/Mongoose/mongoose.js"
import { reindexCollections } from './src/mongodb/reIndex.js';

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'production') {
    const httpsServer = https.createServer(app);
    httpsServer.listen(port, async () => {
        console.log(`HTTPS server running on port ${port}`);
        await connectToMongoDB()
        await mongooseConnection()
    });
} else {
    const httpServer = http.createServer(app);
    httpServer.listen(port, async () => {
        console.log(`HTTP server running on port ${port}`);
        await connectToMongoDB()
        await mongooseConnection()
        await reindexCollections()
    });
}