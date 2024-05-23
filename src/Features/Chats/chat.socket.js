import pool from "../../Mysql/mysql.database.js";
import { Server } from "socket.io";

export const chatSocket = (socket) => {
    socket.on("sendMessage", async (messageData) => {
        let connection = await pool.getConnection()
        try {
            const { message, chatRoomId } = messageData;
            socket.to(chatRoomId).emit("newMessage", messageData)
            // Store message in the database
            await connection.query(
                "INSERT INTO chat (message, user, chat_room_id) VALUES (?, ?, ?)",
                [message, userId, chatRoomId]
            );

            // Broadcast the message to all users in the chat room
            socket.to(chatRoomId).emit("newMessage", messageData);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
};
