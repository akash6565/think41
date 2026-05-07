const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  sold: Number
});

module.exports = mongoose.model('Product', productSchema);
