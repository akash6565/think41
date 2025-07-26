const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const filePath = path.join(__dirname, '../data/products.csv');

const loadProducts = async () => {
  await connectDB();

  const products = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      products.push({
        productId: row.productId,
        name: row.name,
        category: row.category,
        price: parseFloat(row.price),
        quantity: parseInt(row.quantity),
        sold: parseInt(row.sold)
      });
    })
    .on('end', async () => {
      try {
        await Product.deleteMany(); // Optional: clean existing
        await Product.insertMany(products);
        console.log(`✅ ${products.length} products inserted`);
        process.exit(0);
      } catch (error) {
        console.error('❌ Data Insertion Error:', error);
        process.exit(1);
      }
    });
};

loadProducts();
