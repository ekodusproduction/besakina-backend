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
        const db = getDB()

        const pipeline = [
            {
                "$sort": {
                    "createdAt": -1
                }
            },
            {
                "$match": {
                    "$or": [
                        { "sender": new ObjectId(userId) },
                        { "receiver": new ObjectId(userId) }
                    ]
                }
            },
            {
                "$addFields": {
                    "senderReceiver": {
                        "$cond": [
                            { "$gt": ["$sender", "$receiver"] },
                            { "sender": "$receiver", "receiver": "$sender" },
                            { "sender": "$sender", "receiver": "$receiver" }
                        ]
                    }
                }
            },
            {
                "$group": {
                    "_id": "$senderReceiver",
                    "roomId": {
                        "$first": {
                            "$concat": [
                                { "$toString": "$senderReceiver.sender" },
                                "_",
                                { "$toString": "$senderReceiver.receiver" }
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
                    "localField": "_id.sender",
                    "foreignField": "_id",
                    "as": "senderDetails"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "_id.receiver",
                    "foreignField": "_id",
                    "as": "receiverDetails"
                }
            },
            {
                "$project": {
                    "roomId": 1,
                    "lastMessage": 1,
                    "lastTimestamp": 1,
                    "sender": {
                        "$cond": {
                            "if": { "$eq": ["$_id.receiver", new ObjectId(userId)] },
                            "then": { "$arrayElemAt": ["$senderDetails", 0] },
                            "else": { "fullname": "", "profile_pic": "" }
                        }
                    },
                    "receiver": {
                        "$cond": {
                            "if": { "$eq": ["$_id.sender", new ObjectId(userId)] },
                            "then": { "$arrayElemAt": ["$receiverDetails", 0] },
                            "else": { "fullname": "", "profile_pic": "" }
                        }
                    }
                }
            },
            {
                "$project": {
                    "roomId": 1,
                    "lastMessage": 1,
                    "lastTimestamp": 1,
                    "sender.fullname": "$sender.fullname",
                    "sender.profile_pic": "$sender.profile_pic",
                    "receiver.fullname": "$receiver.fullname",
                    "receiver.profile_pic": "$receiver.profile_pic"
                }
            }
        ];

        const rooms = await db.collection("chats").aggregate(pipeline);

        console.log("Rooms:", rooms);

        return sendResponse(res, "Chat rooms list", 200, rooms);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ success: false, error: error.message });
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
        if (transformedMessage.receiver._id == id) {
            transformedMessage.user = transformedMessage.receiver;
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
            $or: [{ sender: userId, receiver: roomId }, { sender: roomId, receiver: userId }]
        }).sort({ createdAt: 1 })

        console.log("Fetched Messages:", messages);

        const result = await transformMessages(messages, userId);
        return sendResponse(res, "Chat message list", 200, result);
    } catch (error) {
        logger.error(error);
        return sendError(res, error.message, 500);
    }
};
