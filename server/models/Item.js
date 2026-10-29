import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  itemType: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['open', 'matched', 'closed'], default: 'open' },
  imageUrl: { type: String, default: '' },
  ownerId: { type: String, required: true },
  reporterName: { type: String, required: true },
  reporterDisplayName: { type: String, default: '' },
  contactInfo: { type: String, default: 'No direct contact shown publicly.' },
  privacyMode: { type: String, enum: ['masked', 'private'], default: 'masked' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);
export default Item;
