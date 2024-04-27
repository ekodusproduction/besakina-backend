import pool from "./src/Mysql/mysql.database.js";
import { Server } from "socket.io";
import { chatSocket } from "./src/Features/Chats/chat.socket.js"

export const socket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    chatSocket(io)
};
