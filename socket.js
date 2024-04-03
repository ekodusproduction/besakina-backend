import pool from "./src/Mysql/mysql.database.js";
import { Server } from "socket.io";

export const initializeSocketIO = (server) => {
    const io = new Server(server);
  
    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("sendMessage", async (messageData) => {
            try {
                const { message, userId, chatRoomId } = messageData;

                // Store message in the database
                const connection = await pool.getConnection();
                await connection.query(
                    "INSERT INTO chat (message, user_id, chat_room_id) VALUES (?, ?, ?)",
                    [message, userId, chatRoomId]
                );
                connection.release();

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
