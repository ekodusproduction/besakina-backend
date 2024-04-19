import pool from "../../Mysql/mysql.database.js";
export const getChatRooms = async function (req, res, next) {
    const connection = await pool.getConnection();
    try {
        const userId = req.userId;
        const selectQuery = `
            SELECT chat_room.*
            FROM chat_room
            JOIN users ON (chat_room.user_id_1 = users.id OR chat_room.user_id_2 = users.id)
            WHERE users.id = ?;
        `;
        const [rows, fields] = await connection.query(selectQuery, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    } finally {
        connection.release();
    }
};

export const getMessagesInChatRoom = async function (req, res, next) {
    const connection = await pool.getConnection();
    try {
        const chatRoomId = req.params.chatRoomId;
        const selectQuery = `
            SELECT chat.*, 
                   sender.username AS sender_username,
                   receiver.username AS receiver_username
            FROM chat
            JOIN users AS sender ON chat.sender_id = sender.id
            JOIN users AS receiver ON chat.receiver_id = receiver.id
            WHERE chat.chat_room_id = ?
            ORDER BY chat.timestamp;
        `;
        const [rows, fields] = await connection.query(selectQuery, [chatRoomId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    } finally {
        connection.release();
    }
};