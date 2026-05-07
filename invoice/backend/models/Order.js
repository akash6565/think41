const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  items: [
    {
      productId: String,
      quantity: Number,
    }
  ],
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
