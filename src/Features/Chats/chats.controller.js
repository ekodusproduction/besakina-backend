import { logger } from "../../Middlewares/logger.middleware.js";
import { sendResponse, sendError } from "../../Utility/response.js";
import Chat from "./chatModel.js";
import { getDB } from "../../mongodb/mongodb.js";


// export const getChatRooms = async (req, res, next) => {
//     try {
//         const userId = req.user;
//         console.log("userId:", userId);

//         const db = getDB();
//         const chatsCollection = db.collection("chats");

//         // Aggregation pipeline
//         const pipeline = [
//             {
//                 $match: {
//                     $or: [{ sender: userId }, { receiver: userId }]
//                 }
//             },
//             {
//                 $project: {
//                     senderReceiver: {
//                         $cond: [
//                             { $gt: ["$sender", "$receiver"] },
//                             { sender: "$receiver", receiver: "$sender" },
//                             { sender: "$sender", receiver: "$receiver" }
//                         ]
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$senderReceiver",
//                     roomId: {
//                         $first: {
//                             $concat: [
//                                 { $toString: "$senderReceiver.sender" },
//                                 "_",
//                                 { $toString: "$senderReceiver.receiver" }
//                             ]
//                         }
//                     }
//                 }
//             }
//         ];

//         const roomsCursor = await chatsCollection.aggregate(pipeline);
//         const groupedRooms = await roomsCursor.toArray();

//         console.log("Grouped Rooms:", groupedRooms);

//         const rooms = groupedRooms.map(room => ({ roomId: room.roomId }));
//         console.log("Rooms:", rooms);

//         return sendResponse(res, "Chat rooms list", 200, rooms);
//     } catch (error) {
//         logger.error(error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };
const removeUser = (array, id) => {
    return array.map(chatRoom => {
        if (chatRoom.sender && chatRoom.sender._id.toString() === id) {
            chatRoom.sender = null;
        }
        if (chatRoom.receiver && chatRoom.receiver._id.toString() === id) {
            chatRoom.receiver = null;
        }
        return chatRoom;
    });
};

export const getChatRooms = async (req, res, next) => {
    try {
        const userId = req.user._id.toString(); // Convert userId to string for comparison
        console.log("userId:", userId);

        // Find all chats where the user is either the sender or the receiver
        const chatRooms = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate(['sender', 'receiver']);

        console.log("Chat Rooms:", chatRooms);

        // Use a Set to store unique combinations of sender and receiver
        const uniquePairs = new Set();
        const uniqueChatRooms = [];

        chatRooms.forEach(chatRoom => {
            const senderId = chatRoom.sender?._id.toString();
            const receiverId = chatRoom.receiver?._id.toString();

            // Create a unique key regardless of order
            const pairKey = [senderId, receiverId].sort().join('-');

            if (!uniquePairs.has(pairKey)) {
                uniquePairs.add(pairKey);
                uniqueChatRooms.push(chatRoom);
            }
        });

        // Remove user from the sender and receiver fields
        const result = removeUser(uniqueChatRooms, userId);

        return sendResponse(res, "Chat rooms list", 200, result);
    } catch (error) {
        logger.error(error);
        return sendError(res, error.message, 500);
    }
};

const transformMessages = (array, id) => {
    return array.map(message => {
        const transformedMessage = message.toObject(); // Convert Mongoose document to plain object
        if (transformedMessage.sender._id.toString() === id) {
            transformedMessage.user = transformedMessage.sender;
        }
        if (transformedMessage.receiver._id.toString() === id) {
            transformedMessage.user = transformedMessage.receiver;
        }
        return transformedMessage;
    });
};

export const getMessagesInChatRoom = async (req, res, next) => {
    try {
        const { id: roomId } = req.params;
        const userId = req.user._id.toString(); // Convert userId to string for comparison

        const messages = await Chat.find({
            $or: [{ sender: userId, receiver: roomId }, { sender: roomId, receiver: userId }]
        }).sort({ createdAt: -1 }).populate(['sender', 'receiver']);

        console.log("Fetched Messages:", messages);

        const result = transformMessages(messages, userId);
        return sendResponse(res, "Chat message list", 200, result);
    } catch (error) {
        logger.error(error);
        return sendError(res, error.message, 500);
    }
};
