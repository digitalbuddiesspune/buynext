import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Order from '../models/Order.js';

const parseRupeeValue = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = String(value).replace(/[^0-9.]/g, '');
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
};

async function fixOrders() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const orders = await Order.find({ amount: 0 });
  console.log(`Found ${orders.length} orders with 0 amount`);

  for (const order of orders) {
    let total = 0;
    const updatedItems = [];

    for (const it of order.items) {
      let itemPrice = it.price || 0;
      if (itemPrice === 0) {
        const prod = await mongoose.connection.db.collection('products').findOne({
          _id: new mongoose.Types.ObjectId(it.product),
        });
        if (prod) {
          itemPrice = parseRupeeValue(prod.mrp || prod.MRP);
        }
      }
      updatedItems.push({
        product: it.product,
        quantity: it.quantity,
        price: itemPrice,
        size: it.size,
      });
      total += itemPrice * (it.quantity || 1);
    }

    await Order.findByIdAndUpdate(order._id, {
      items: updatedItems,
      amount: total,
    });
    console.log(`Updated Order ${order._id} with new total amount: ₹${total}`);
  }

  console.log('All 0 price orders fixed!');
  await mongoose.disconnect();
}

fixOrders().catch((err) => {
  console.error(err);
  process.exit(1);
});
