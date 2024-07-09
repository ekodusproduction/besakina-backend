import { logger } from "../../Middlewares/logger.middleware.js";
import { sendResponse, sendError } from "../../Utility/response.js";
import Chat from "./chatModel.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { getDB } from "../../mongodb/mongodb.js";

export const getChatRooms = async (req, res, next) => {
    try {
        const userId = req.user.toString(); // Assuming userId is obtained from req.user

        const pipeline = [
            {
                "$sort": {
                    "createdAt": -1
                }
            },
            {
                $match: {
                    $or: [{ sender: new ObjectId(userId) }, { receiver: new ObjectId(userId) }]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'sender'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'receiver',
                    foreignField: '_id',
                    as: 'receiver'
                }
            },
            {
                $unwind: { path: '$sender', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    senderId: { $ifNull: ['$sender._id', null] },
                    receiverId: { $ifNull: ['$receiver._id', null] }
                }
            },
            {
                $group: {
                    _id: {
                        senderId: '$senderId',
                        receiverId: '$receiverId'
                    },
                    chatRoom: { $first: '$$ROOT' }
                }
            },
            {
                $project: {
                    _id: 0,
                    'chatRoom._id': 1,
                    'chatRoom.message': 1,
                    'chatRoom.timestamp': 1,
                    'chatRoom.sender': {
                        $cond: [
                            { $eq: ['$chatRoom.sender._id', new ObjectId(userId)] },
                            null,
                            {
                                _id: '$chatRoom.sender._id',
                                fullname: { $ifNull: ['$chatRoom.sender.fullname', 'No Name'] },
                                profile_pic: { $ifNull: ['$chatRoom.sender.profile_pic', 'No Pic'] },
                                mobile: { $ifNull: ['$chatRoom.sender.mobile', 'No Mobile'] }
                            }
                        ]
                    },
                    'chatRoom.receiver': {
                        $cond: [
                            { $eq: ['$chatRoom.receiver._id', new ObjectId(userId)] },
                            null,
                            {
                                _id: '$chatRoom.receiver._id',
                                fullname: { $ifNull: ['$chatRoom.receiver.fullname', 'No Name'] },
                                profile_pic: { $ifNull: ['$chatRoom.receiver.profile_pic', 'No Pic'] },
                                mobile: { $ifNull: ['$chatRoom.receiver.mobile', 'No Mobile'] }
                            }
                        ]
                    }
                }
            }
        ];

        const rooms = await Chat.aggregate(pipeline);

        // Prepare and send response
        return res.status(200).json({
            message: 'Chat rooms list',
            http_status_code: 200,
            success: true,
            data: rooms,
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
