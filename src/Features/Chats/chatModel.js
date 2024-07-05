import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false }
}, { timestamps: true });

chatSchema.index({ receiver: 1, sender: 1 });
chatSchema.index({ roomId: 1 });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
