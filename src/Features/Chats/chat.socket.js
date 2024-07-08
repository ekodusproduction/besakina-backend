import Chat from "./chatModel.js";

export const chatSocket = (socket) => {

    socket.on('join', async ({ recieverId }) => {
        try {
            // console.log("data--------->", data)
            console.log("join event fired");
            const sender = socket.user;
            console.log("sender", sender);
            const roomId = [recieverId, sender].sort().join("_");
            socket.join(roomId);
            socket.emit('joinedRoom', { roomId, message: `You have joined room ${roomId}` });
            console.log(`User joined room: ${roomId}`);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    });

    socket.on("sendMessage", async (messageData) => {
        try {
            console.log("sendMessage event fired", messageData);

            const recieverId = messageData.receiver;
            const sender = socket.user;
            console.log("sender", sender);
            const roomId = [recieverId, sender].sort().join("_");
            messageData.roomId = roomId;
            messageData.sender = sender;
            const message = await Chat.create(messageData);
            messageData.user = sender;

            console.log("message", message);
            if (socket.rooms.has(roomId)) {
                console.log("has room ");
                socket.to(roomId).emit("receivedMessage", message);
                console.log(`Message sent to room: ${roomId}`, message);
            } else {
                console.error(`Socket is not in the room: ${roomId}`);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    socket.on("isActive", async (messageData) => {
        try {
            const receiverId = messageData.receiver;
            const sender = socket.user;
            const roomId = [receiverId, sender.id].sort().join("_");

            // Check if the recipient is active
            const isRecipientActive = await redisClient.sismember('onlineUsers', receiverId);

            if (socket.rooms.has(roomId)) {
                socket.emit("userIsActive", { userId: receiverId, isActive: isRecipientActive });
                console.log(`isActive event sent to user: ${sender.username} for room: ${roomId}`);
            } else {
                console.error(`Socket is not in the room: ${roomId}`);
            }
        } catch (error) {
            console.error("Error sending isActive event:", error);
        }
    });



};
