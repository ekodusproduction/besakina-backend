import Chat from "./chatModel.js";

export const chatSocket = (socket) => {

    socket.on('join', async () => {
        try {
            const sender = socket.user;
            console.log("sender", sender)
            const roomId = sender
            socket.join(roomId);
            socket.emit('joinedRoom', { roomId, message: `You have joined room ${roomId}` });
            console.log(`User joined room: ${roomId}`);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    });

    socket.on("sendMessage", async (messageData) => {
        try {
            const { receiver } = messageData;
            const sender = socket.user;
            console.log("sender", sender)
            const roomId = receiver;
            socket.join(roomId);
            messageData.roomId = roomId;
            messageData.sender = sender;
            const message = await Chat.create(messageData);
            console.log("message", message)
            if (socket.rooms.has(roomId)) {
                console.log("has room ")
                socket.to(roomId).emit("receivedMessage", message);
                // socket.emit('receivedMessage', { roomId, message: message });
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
            const sender = socket.user;
            const roomId = sender
            messageData.roomId = roomId;

            // Check if the socket is in the room before sending the isActive event
            if (socket.rooms.has(roomId)) {
                console.log("has room ");
                io.emit("isActive", { isActive: true,  }); // Broadcast to everyone
                console.log(`isActive event broadcast to all clients for room: ${roomId}`);
            } else {
                console.error(`Socket is not in the room: ${roomId}`);
            }
        } catch (error) {
            console.error("Error sending isActive event:", error);
        }
    });

};
