import Order from '../models/Order.js';
import { Product } from '../models/Product.js';

const parseRupeeToNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = String(value).replace(/[^0-9.]/g, '');
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Helper function to find product in unified collection
async function findProductById(productId) {
  if (!productId) {
    return null;
  }
  
  const idString = productId._id ? productId._id.toString() : (productId.toString ? productId.toString() : productId);
  return Product.findById(idString);
}

// Helper function to populate order items with products from all collections
async function populateOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }
  
  return Promise.all(
    items.map(async (item) => {
      try {
        const productId = item.product?._id || (item.product?.toString ? item.product.toString() : item.product);
        
        if (!productId) {
          return {
            ...item,
            price: item.price || 0,
            product: { _id: null, title: 'Product' },
          };
        }
        
        const product = await findProductById(productId);
        const productObj = product ? (product.toObject ? product.toObject() : product) : null;
        
        if (productObj) {
          if (!productObj.title && productObj['SKU Name']) {
            productObj.title = productObj['SKU Name'];
          }
          if ((!productObj.mrp || Number.isNaN(Number(productObj.mrp))) && productObj['MRP']) {
            productObj.mrp = parseRupeeToNumber(productObj['MRP']);
          }
          if (!productObj.images) productObj.images = {};
          if (!productObj.images.image1 && productObj['Image Link']) {
            productObj.images.image1 = productObj['Image Link'];
          }
          if (!productObj.price) {
            productObj.price = productObj.mrp || parseRupeeToNumber(productObj['MRP']) || 0;
          }
        }
        
        const effectivePrice = item.price && item.price > 0 
          ? item.price 
          : (productObj?.price || productObj?.mrp || parseRupeeToNumber(productObj?.['MRP']) || 0);

        return {
          ...item,
          price: effectivePrice,
          product: productObj || { _id: productId, title: 'Product', price: effectivePrice },
        };
      } catch (err) {
        console.error(`[populateOrderItems] Error processing item:`, err);
        return {
          ...item,
          price: item.price || 0,
          product: { _id: item.product, title: 'Product' },
        };
      }
    })
  );
}

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        try {
          const populatedItems = await populateOrderItems(order.items || []);
          const totalAmount = (order.amount && order.amount > 0)
            ? order.amount
            : populatedItems.reduce((sum, it) => sum + (it.price * (it.quantity || 1)), 0);

          return {
            ...order,
            amount: totalAmount,
            items: populatedItems,
          };
        } catch (err) {
          console.error(`[getMyOrders] Error processing order ${order._id}:`, err);
          return {
            ...order,
            items: [],
          };
        }
      })
    );

    return res.json(populatedOrders);
  } catch (err) {
    console.error('[getMyOrders] Error fetching orders:', err);
    return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: userId }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const populatedItems = await populateOrderItems(order.items || []);
    const totalAmount = (order.amount && order.amount > 0)
      ? order.amount
      : populatedItems.reduce((sum, it) => sum + (it.price * (it.quantity || 1)), 0);

    const populatedOrder = {
      ...order,
      amount: totalAmount,
      items: populatedItems,
    };

    return res.json(populatedOrder);
  } catch (err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};
