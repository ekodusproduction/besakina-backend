import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from 'http';
import { Server } from "socket.io";
import { chatSocket } from "./src/Features/Chats/chat.socket.js"
// import { initializeSocketIO } from './socket.js';

const server = http.createServer(app);
chatSocket(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
