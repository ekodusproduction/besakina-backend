import { logger } from "../../Middlewares/logger.middleware.js";
import pool from
    "../../Mysql/mysql.database.js";
import { sendResponse } from "../../Utility/response.js";

export const getAChatRoom = async function (req, res, next) {
    try {
        const userId1 = req.userId;
        const userId2 = req.body.otherUserId;

        const rows = await connection.query('chat_room')
            .where(function () {
                this.where('user_id_1', userId1).andWhere('user_id_2', userId2)
                    .orWhere('user_id_1', userId2).andWhere('user_id_2', userId1);
            });

        return sendResponse(res, "Chat room list", 200, rows);
    } catch (error) {
        logger.info(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getChatRooms = async function (req, res, next) {
    try {
        const userId = req.userId;

        const rows = await connection.query('chat_room')
            .join('users', function () {
                this.on('chat_room.user_id_1', '=', 'users.id').orWhere('chat_room.user_id_2', '=', 'users.id');
            })
            .where('users.id', userId);

        return sendResponse(res, "Chat room list", 200, rows);
    } catch (error) {
        logger.info(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getMessagesInChatRoom = async function (req, res, next) {
    try {
        const chatRoomId = req.params.chatRoomId;

        const rows = await connection.query('chat')
            .select('chat.*', 'sender.username AS sender_username', 'receiver.username AS receiver_username')
            .join('users AS sender', 'chat.sender_id', '=', 'sender.id')
            .join('users AS receiver', 'chat.receiver_id', '=', 'receiver.id')
            .where('chat.chat_room_id', chatRoomId)
            .orderBy('chat.timestamp');

        return sendResponse(res, "Chat room list", 200, rows);
    } catch (error) {
        logger.info(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const createChatRoom = async function (req, res, next) {
    try {
        const [existingChatRow] = await connection.query('chat_room')
            .where(function () {
                this.where('user_id_1', req.userId).andWhere('user_id_2', req.body.user_id_2)
                    .orWhere('user_id_1', req.body.user_id_2).andWhere('user_id_2', req.userId);
            })
            .limit(1);

        if (existingChatRow) {
            return sendResponse(res, "Chat room already exists", 200, existingChatRow.id);
        }


        const [insertRows] = await connection.query('chat_room').insert({ user_id_1: req.userId, user_id_2: req.body.user_id_2 });

        return sendResponse(res, "Chat room created successfully", 201, insertRows[0]);
    } catch (error) {
        logger.info(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};
