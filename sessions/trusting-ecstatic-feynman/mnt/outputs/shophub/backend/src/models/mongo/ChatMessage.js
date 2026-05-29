const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  room: { type: String, required: true, index: true },
  userId: { type: Number, required: true },
  userName: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
