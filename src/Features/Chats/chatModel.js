import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: String, required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false }
}, { timestamps: true });

chatSchema.index({ reciever: 1, sender: 1 });
chatSchema.index({ roomId: 1 });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
