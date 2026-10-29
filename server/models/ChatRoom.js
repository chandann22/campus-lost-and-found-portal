import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  ownerId: { type: String, required: true },
  claimantId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isAnonymous: { type: Boolean, default: true }
}, { versionKey: false });

const ChatRoom = mongoose.models.ChatRoom || mongoose.model('ChatRoom', chatRoomSchema);
export default ChatRoom;
