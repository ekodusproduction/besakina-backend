import Chat from "./chatModel.js";

export const chatSocket = (socket) => {

    socket.on('join', async ({ receiver }) => {
        try {
            const sender = socket.user;
            console.log("sender", sender)

            const roomId = [sender, receiver].sort().join('_');
            socket.join(roomId);
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
            const roomId = [sender, receiver].sort().join('_');
            messageData.roomId = roomId;
            const message = await Chat.create(messageData);

            // Check if the socket is in the room before sending the message
            if (socket.rooms.has(roomId)) {
                console.log("has room ")
                socket.to(roomId).emit("newMessage", message);
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
            const { receiver } = messageData;
            const roomId = [sender, receiver].sort().join('_');
            messageData.roomId = roomId;

            // Check if the socket is in the room before sending the isActive event
            if (socket.rooms.has(roomId)) {
                console.log("has room ")
                socket.to(roomId).emit("isActive", { isActive: true });
                console.log(`isActive event emitted to room: ${roomId}`);
            } else {
                console.error(`Socket is not in the room: ${roomId}`);
            }
        } catch (error) {
            console.error("Error sending isActive event:", error);
        }
    });

};
