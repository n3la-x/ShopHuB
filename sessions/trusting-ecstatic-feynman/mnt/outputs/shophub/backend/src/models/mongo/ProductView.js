const mongoose = require('mongoose');

const productViewSchema = new mongoose.Schema({
  productId: { type: Number, required: true, index: true },
  userId: { type: Number },
  sessionId: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ProductView', productViewSchema);
