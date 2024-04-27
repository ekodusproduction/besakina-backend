import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from 'http';
import { Server } from "socket.io";
// import { initializeSocketIO } from './socket.js';
import { jwtAuth } from './src/Middlewares/auth.middleware.js';
// import { socket } from './socket.js';
import { chatSocket } from './src/Features/Chats/chat.socket.js';
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"]
    }
})
// io.on("connection", (socket) => {
//     console.log("Connection established");
// })

// chatSocket(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
