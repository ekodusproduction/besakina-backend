import Chat from "./chatModel.js";

export const chatSocket = (socket) => {

    socket.on('join', async ({ user1, user2 }) => {
        try {
            const roomId = [user1, user2].sort().join('_');
            socket.join(roomId);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    });

    socket.on("sendMessage", async (messageData) => {
        try {
            const { sender, receiver } = messageData;
            const roomId = [sender, receiver].sort().join('_');
            messageData.roomId = roomId;
            const message = await Chat.create(messageData);
            socket.to(roomId).emit("newMessage", message);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    socket.on("isActive", async (messageData) => {
        try {
            const { sender, receiver } = messageData;
            const roomId = [sender, receiver].sort().join('_');
            messageData.roomId = roomId;
            const message = await Chat.create(messageData);
            socket.to(roomId).emit("isActive", { isActive: true });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
};
