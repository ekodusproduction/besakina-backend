import pool from
    "./src/Mysql/mysql.database.js";
import { Server } from "socket.io";

export const chatSocket = (server) => {
    const io = new Server(server, cors: {
        origin: "*",
        methods: ["GET", "POST"]
    });

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("sendMessage", async (messageData) => {
            try {
                const { message, userId, chatRoomId } = messageData;

                // Store message in the database
                await connection.query.raw(
                    "INSERT INTO chat (message, user_id, chat_room_id) VALUES (?, ?, ?)",
                    [message, userId, chatRoomId]
                );

                // Broadcast the message to all users in the chat room
                io.to(chatRoomId).emit("newMessage", messageData);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};
