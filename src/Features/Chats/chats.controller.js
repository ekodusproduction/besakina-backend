import { logger } from "../../Middlewares/logger.middleware.js";
import { sendResponse, sendError } from "../../Utility/response.js";
import Chat from "./chatModel.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { getDB } from "../../mongodb/mongodb.js";

export const getChatRooms = async (req, res, next) => {
    try {
        const userId = req.user.toString();
        console.log("userId:", userId);

        const pipeline = [
            {
                "$sort": {
                    "createdAt": -1
                }
            },
            {
                "$match": {
                    "$or": [
                        { "sender": userId },
                        { "receiver": userId }
                    ]
                }
            },
            {
                "$addFields": {
                    "participant": {
                        "$cond": {
                            "if": { "$eq": ["$sender", userId] },
                            "then": "$receiver",
                            "else": "$sender"
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": "$participant",
                    "roomId": {
                        "$first": {
                            "$concat": [
                                { "$toString": "$participant" },
                                "_",
                                { "$toString": { "$ifNull": ["$_id", "$participant"] } }
                            ]
                        }
                    },
                    "lastMessage": { "$first": "$message" },
                    "lastTimestamp": { "$first": "$createdAt" }
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "participantDetails"
                }
            },
            {
                "$project": {
                    "roomId": 1,
                    "lastMessage": 1,
                    "lastTimestamp": 1,
                    "participant": {
                        "$arrayElemAt": ["$participantDetails", 0]
                    }
                }
            },
            {
                "$project": {
                    "roomId": 1,
                    "lastMessage": 1,
                    "lastTimestamp": 1,
                    "participant.fullname": 1,
                    "participant.profile_pic": 1,
                    "participant._id": 1,
                    "participant.mobile": 1
                }
            }
        ];

        const rooms = await Chat.aggregate(pipeline);

        console.log("Rooms:", rooms);

        return sendResponse(res, "Chat rooms list", 200, rooms);
    } catch (error) {
        console.error("Error fetching chat rooms:", error);
        return sendError(res, "Failed to fetch chat rooms", 500);
    }
};

// const removeUser = async (array, id) => {
//     return array.map(chatRoom => {
//         if (chatRoom.sender && chatRoom.sender._id.toString() === id) {
//             chatRoom.sender = null;
//         }
//         if (chatRoom.receiver && chatRoom.receiver._id.toString() === id) {
//             chatRoom.receiver = null;
//         }
//         return chatRoom;
//     });
// };

// export const getChatRooms = async (req, res, next) => {
//     try {
//         const userId = req.user; // Convert userId to string for comparison
//         console.log("userId:", userId);

//         // Find all chats where the user is either the sender or the receiver
//         const chatRooms = await Chat.find({
//             $or: [{ sender: userId }, { receiver: userId }]
//         }).populate(['sender', 'receiver']);

//         console.log("Chat Rooms:", chatRooms);

//         // Use a Set to store unique combinations of sender and receiver
//         const uniquePairs = new Set();
//         const uniqueChatRooms = [];

//         chatRooms.forEach(chatRoom => {
//             const senderId = chatRoom.sender?._id.toString();
//             const receiverId = chatRoom.receiver?._id.toString();

//             const pairKey = [senderId, receiverId].sort().join('-');

//             if (!uniquePairs.has(pairKey)) {
//                 uniquePairs.add(pairKey);
//                 uniqueChatRooms.push(chatRoom);
//             }
//         });

//         const result = await removeUser(uniqueChatRooms, userId);

//         return sendResponse(res, "Chat rooms list", 200, result);
//     } catch (error) {
//         logger.error(error);
//         return sendError(res, error.message, 500);
//     }
// };

const transformMessages = async (array, id) => {
    return array.map(message => {
        const transformedMessage = message.toObject(); // Convert Mongoose document to plain object
        if (transformedMessage.sender._id == id) {
            transformedMessage.user = transformedMessage.sender;
        }
        if (transformedMessage.reciever._id == id) {
            transformedMessage.user = transformedMessage.reciever;
        }
        return transformedMessage;
    });
};

export const getMessagesInChatRoom = async (req, res, next) => {
    try {
        const roomId = req.params.id;
        console.log("rooms", roomId)
        const userId = req.user;

        const messages = await Chat.find({
            $or: [{ sender: userId, reciever: roomId }, { sender: roomId, reciever: userId }]
        }).sort({ createdAt: 1 })

        console.log("Fetched Messages:", messages);

        const result = await transformMessages(messages, userId);
        return sendResponse(res, "Chat message list", 200, result);
    } catch (error) {
        logger.error(error);
        return sendError(res, error.message, 500);
    }
};
