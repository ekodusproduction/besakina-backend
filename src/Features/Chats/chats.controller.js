import { logger } from "../../Middlewares/logger.middleware.js";
import { sendResponse, sendError } from "../../Utility/response.js";
import Chat from "./chatModel.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { getDB } from "../../mongodb/mongodb.js";

export const getChatRooms = async (req, res, next) => { 
    try {
        const userId = new ObjectId(req.user.toString());

        const pipeline = [
            {
                $match: {
                    $or: [{ sender: userId }, { reciever: userId }]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        senderId: { $cond: [{ $eq: ['$sender', userId] }, '$reciever', '$sender'] },
                        recieverId: { $cond: [{ $eq: ['$reciever', userId] }, '$sender', '$reciever'] }
                    },
                    lastMessage: { $first: '$$ROOT' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.senderId',
                    foreignField: '_id',
                    as: 'sender'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.recieverId',
                    foreignField: '_id',
                    as: 'reciever'
                }
            },
            {
                $unwind: { path: '$sender', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$reciever', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: '$lastMessage._id',
                    message: '$lastMessage.message',
                    timestamp: '$lastMessage.createdAt',
                    sender: {
                        $cond: [
                            { $eq: ['$lastMessage.sender', userId] },
                            null,
                            {
                                _id: '$sender._id',
                                fullname: { $ifNull: ['$sender.fullname', 'No Name'] },
                                profile_pic: { $ifNull: ['$sender.profile_pic', 'No Pic'] },
                                mobile: { $ifNull: ['$sender.mobile', 'No Mobile'] }
                            }
                        ]
                    },
                    reciever: {
                        $cond: [
                            { $eq: ['$lastMessage.reciever', userId] },
                            null,
                            {
                                _id: '$reciever._id',
                                fullname: { $ifNull: ['$reciever.fullname', 'No Name'] },
                                profile_pic: { $ifNull: ['$reciever.profile_pic', 'No Pic'] },
                                mobile: { $ifNull: ['$reciever.mobile', 'No Mobile'] }
                            }
                        ]
                    }
                }
            },
            {
                $match: {
                    $or: [
                        { 'sender': { $ne: null } },
                        { 'reciever': { $ne: null } }
                    ]
                }
            }
        ];

        const rooms = await Chat.aggregate(pipeline);

        return res.status(200).json({
            message: 'Chat rooms list',
            http_status_code: 200,
            success: true,
            data: rooms.map(doc => ({
                _id: doc._id,
                message: doc.message,
                timestamp: doc.timestamp,
                sender: doc.sender,
                reciever: doc.reciever
            })),
            token: null
        });
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        return res.status(500).json({
            message: 'Internal server error',
            http_status_code: 500,
            success: false,
            error: error.message
        });
    }
};

// const removeUser = async (array, id) => {
//     return array.map(chatRoom => {
//         if (chatRoom.sender && chatRoom.sender._id.toString() === id) {
//             chatRoom.sender = null;
//         }
//         if (chatRoom.reciever && chatRoom.reciever._id.toString() === id) {
//             chatRoom.reciever = null;
//         }
//         return chatRoom;
//     });
// };

// export const getChatRooms = async (req, res, next) => {
//     try {
//         const userId = req.user; // Convert userId to string for comparison
//         console.log("userId:", userId);

//         // Find all chats where the user is either the sender or the reciever
//         const chatRooms = await Chat.find({
//             $or: [{ sender: userId }, { reciever: userId }]
//         }).populate(['sender', 'reciever']);

//         console.log("Chat Rooms:", chatRooms);

//         // Use a Set to store unique combinations of sender and reciever
//         const uniquePairs = new Set();
//         const uniqueChatRooms = [];

//         chatRooms.forEach(chatRoom => {
//             const senderId = chatRoom.sender?._id.toString();
//             const receiverId = chatRoom.reciever?._id.toString();

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
        const userId = new mongoose.Types.ObjectId(req.user.toString());
        const recieverId = new mongoose.Types.ObjectId(req.params.id);
        const roomId = [recieverId, userId].sort().join("_");

        const pipeline = [
            {
                $match: { roomId: roomId }
            },
            {
                $sort: { createdAt: 1 }
            },
            {
                $addFields: {
                    user: {
                        $cond: {
                            if: { $eq: ['$sender', userId] },
                            then: '$sender',
                            else: '$reciever'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    message: 1,
                    seen: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    sender: 1,
                    reciever: 1,
                    user: 1
                }
            }
        ];

        const messages = await Chat.aggregate(pipeline);

        return res.status(200).json({
            message: 'Chat message list',
            http_status_code: 200,
            success: true,
            data: messages,
            token: null
        });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        return res.status(500).json({
            message: 'Internal server error',
            http_status_code: 500,
            success: false,
            error: error.message
        });
    }
};