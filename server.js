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



const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    const privateKey = fs.readFileSync('./private.key', 'utf8');
    const certificate = fs.readFileSync('./certificate.pem', 'utf8');

    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(port, async () => {
        console.log(`Server running on port ${port}`);
        await connectToMongoDB()
        await mongooseConnection()
    });
} else {
    const httpServer = http.createServer(app);

    httpServer.listen(port, async () => {
        console.log(`Server running on port ${port}`);
        await connectToMongoDB()
        await mongooseConnection()
    });
}