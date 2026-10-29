import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderType: { type: String, enum: ['owner', 'claimant', 'admin'], required: true },
  body: { type: String, required: true, trim: true },
  maskedSender: { type: String, default: 'Anonymous User' },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
