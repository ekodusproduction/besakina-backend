import { logger } from "../../Middlewares/logger.middleware.js";
import { sendResponse } from "../../Utility/response.js";
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

export const getChatRooms = async (req, res, next) => {
    try {
        const userId = req.user;
        console.log("userId:", userId);


        // Find all chats where the user is either the sender or the receiver
        const chatRooms = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })

        console.log("Chat Rooms:", chatRooms);

        // Extract room IDs from chat rooms
        const rooms = chatRooms.map(chat => {
            const senderReceiver = [chat.sender, chat.receiver].sort();
            const roomId = senderReceiver.join('_');
            return { roomId };
        });

        // Remove duplicate room IDs
        const uniqueRooms = Array.from(new Set(rooms.map(room => room.roomId)))
            .map(roomId => ({ roomId }));

        console.log("Unique Rooms:", uniqueRooms);

        return sendResponse(res, "Chat rooms list", 200, uniqueRooms);
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