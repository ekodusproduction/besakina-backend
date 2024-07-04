import { logger } from "../../Middlewares/logger.middleware.js";
import { sendResponse } from "../../Utility/response.js";
import Chat from "./chatModel.js";


export const getChatRooms = async (req, res, next) => {
    try {
        const userId = req.user;
        console.log("userId:", userId);

        // Step 1: Match messages where user is sender or receiver
        const matchedMessages = await Chat.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            }
        ]);

        console.log("Matched Messages:", matchedMessages);

        // Step 2: Project senderReceiver field based on comparison
        const projectedMessages = await Chat.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            },
            {
                $project: {
                    senderReceiver: {
                        $cond: [
                            { $gt: ["$sender", "$receiver"] },
                            { sender: "$receiver", receiver: "$sender" },
                            { sender: "$sender", receiver: "$receiver" }
                        ]
                    }
                }
            }
        ]);

        console.log("Projected Messages:", projectedMessages);

        // Step 3: Group by senderReceiver and construct roomId
        const groupedRooms = await Chat.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            },
            {
                $project: {
                    senderReceiver: {
                        $cond: [
                            { $gt: ["$sender", "$receiver"] },
                            { sender: "$receiver", receiver: "$sender" },
                            { sender: "$sender", receiver: "$receiver" }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$senderReceiver",
                    roomId: {
                        $first: {
                            $concat: [
                                { $toString: "$senderReceiver.sender" },
                                "_",
                                { $toString: "$senderReceiver.receiver" }
                            ]
                        }
                    }
                }
            }
        ]);

        console.log("Grouped Rooms:", groupedRooms);

        // Step 4: Project roomId
        const rooms = groupedRooms.map(room => ({ roomId: room.roomId }));

        console.log("Rooms:", rooms);

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