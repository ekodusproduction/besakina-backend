import { logger } from "../../Middlewares/logger.middleware.js";
import { sendResponse } from "../../Utility/response.js";
import Chat from "./chatModel.js";
import mongoose from "mongoose"

export const getChatRooms = async (req, res, next) => {
    try {
        const userId = req.user;
        const rooms = await Chat.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            },
            {
                $group: {
                    _id: {
                        senderReceiver: {
                            $cond: [
                                { $gt: ["$sender", "$receiver"] },
                                { sender: "$receiver", receiver: "$sender" },
                                { sender: "$sender", receiver: "$receiver" }
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    roomId: { $concat: [{ $toString: "$_id.senderReceiver.sender" }, "_", { $toString: "$_id.senderReceiver.receiver" }] }
                }
            }
        ]);

        return sendResponse(res, "Chat rooms list", 200, rooms);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getMessagesInChatRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const messages = await Chat.find({ roomId }).sort({ createdAt: -1 });

        return sendResponse(res, "Chat message list", 200, messages);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};