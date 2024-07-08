import Chat from "./chatModel.js";

export const chatSocket = (socket) => {

    socket.on('join', async ({ recieverId }) => {
        try {
            console.log("data--------->", data)
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
            console.log("sendMessage event fired");

            const { recieverId } = messageData;
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
            console.log("isActive event fired");

            const sender = socket.user;
            const roomId = sender; // Assuming sender is the unique identifier for the room in this context
            messageData.roomId = roomId;

            // Check if the socket is in the room before sending the isActive event
            if (socket.rooms.has(roomId)) {
                console.log("has room ");
                io.emit("isActive", { isActive: true }); // Broadcast to everyone
                console.log(`isActive event broadcast to all clients for room: ${roomId}`);
            } else {
                console.error(`Socket is not in the room: ${roomId}`);
            }
        } catch (error) {
            console.error("Error sending isActive event:", error);
        }
    });

};
