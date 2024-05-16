import { logger } from "../../Middlewares/logger.middleware.js";
import pool from "../../Mysql/mysql.database.js";
import { sendResponse } from "../../Utility/response.js";

export const getAChatRoom = async function (req, res, next) {
    try {
        const userId1 = req.userId;
        const userId2 = req.body.otherUserId;

        const [rows] = await pool.query('SELECT * FROM chat_room WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)', [userId1, userId2, userId2, userId1]);

        return await sendResponse(res, "Chat room list", 200, rows);
    } catch (error) {
        logger.info(error);
        return res.status(500).json({ success: false, error: error });
    }
};

export const getChatRooms = async function (req, res, next) {
    try {
        const userId = req.userId;

        const [rows] = await pool.query('SELECT chat_room.* FROM chat_room JOIN users ON (chat_room.user_id_1 = users.id OR chat_room.user_id_2 = users.id) WHERE users.id = ?', [userId]);

        return await sendResponse(res, "Chat room list", 200, rows);
    } catch (error) {
        logger.info(error);
        return res.status(500).json({ success: false, error: error });
    }
};

export const getMessagesInChatRoom = async function (req, res, next) {
    try {
        const chatRoomId = req.params.chatRoomId;

        const [rows] = await pool.query('SELECT chat.*, sender.username AS sender_username, receiver.username AS receiver_username FROM chat JOIN users AS sender ON chat.sender_id = sender.id JOIN users AS receiver ON chat.receiver_id = receiver.id WHERE chat.chat_room_id = ? ORDER BY chat.timestamp', [chatRoomId]);

        return await sendResponse(res, "Chat room list", 200, rows);
    } catch (error) {
        logger.info(error);
        return res.status(500).json({ success: false, error: error });
    }
};

export const createChatRoom = async function (req, res, next) {
    try {
        const [existingChatRow] = await pool.query('SELECT * FROM chat_room WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?) LIMIT 1', [req.userId, req.body.user_id_2, req.body.user_id_2, req.userId]);

        if (existingChatRow.length > 0) {
            return await sendResponse(res, "Chat room already exists", 200, existingChatRow[0].id);
        }

        const [insertRows] = await pool.query('INSERT INTO chat_room (user_id_1, user_id_2) VALUES (?, ?)', [req.userId, req.body.user_id_2]);

        return await sendResponse(res, "Chat room created successfully", 201, insertRows.insertId);
    } catch (error) {
        logger.info(error);
        return res.status(500).json({ success: false, error: error });
    }
};
