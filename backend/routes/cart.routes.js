import { Router } from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import Cart from '../models/Cart.js';
import { Product } from '../models/product.js';

const router = Router();

const parseRupeeToNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = String(value).replace(/[^0-9.]/g, '');
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Helper function to find product in unified collection
async function findProductById(productId) {
  if (!productId) return null;
  const idString = productId._id ? productId._id.toString() : (productId.toString ? productId.toString() : String(productId));
  if (!mongoose.isValidObjectId(idString)) return null;
  return Product.findById(idString).lean();
}

// Helper function to populate cart items
async function populateCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) return [];

  return Promise.all(
    items.map(async (item) => {
      const rawItem = item.toObject ? item.toObject() : item;
      const productId = rawItem.product?._id || rawItem.product;
      const product = await findProductById(productId);

      if (product) {
        const title = product.title || product['SKU Name'] || product.name || product['Product Name'] || product.skuName || 'Product';
        const mrp = typeof product.mrp === 'number' ? product.mrp : parseRupeeToNumber(product['MRP']);
        const price = typeof product.price === 'number' ? product.price : (mrp || 0);

        let image = null;
        if (product.images) {
          if (typeof product.images === 'object' && !Array.isArray(product.images)) {
            image = product.images.image1 || product.images.image2 || product.images.image3 || null;
          } else if (Array.isArray(product.images) && product.images.length > 0) {
            const first = product.images[0];
            image = typeof first === 'string' ? first : (first?.url || null);
          }
        }
        if (!image && product['Image Link']) image = product['Image Link'];
        if (!image && product.image) image = typeof product.image === 'string' ? product.image : product.image?.url;
        if (!image && product.imageUrl) image = product.imageUrl;
        if (!image && product.imageLink) image = product.imageLink;
        if (!image && product.sourceData?.imageLink) image = product.sourceData.imageLink;

        const imagesObj = {
          ...(product.images && typeof product.images === 'object' && !Array.isArray(product.images) ? product.images : {}),
          image1: image || product.images?.image1 || null,
        };

        return {
          ...rawItem,
          price: rawItem.price && rawItem.price > 0 ? rawItem.price : price,
          product: {
            ...product,
            _id: product._id || productId,
            id: product._id || productId,
            title,
            name: title,
            price,
            mrp,
            image,
            images: imagesObj,
          },
        };
      }

      return {
        ...rawItem,
        price: rawItem.price || 0,
        product: rawItem.product || { _id: productId, title: 'Product' },
      };
    })
  );
}

// GET /api/cart -> current user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.json({ user: req.userId, items: [] });
    }

    // Manually populate products from unified collection
    const populatedItems = await populateCartItems(cart.items);

    res.json({
      ...(cart.toObject ? cart.toObject() : cart),
      items: populatedItems,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
});

// POST /api/cart/add -> { productId, quantity?, size? }
router.post('/add', auth, async (req, res) => {
  const { productId, quantity = 1, size } = req.body || {};
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid productId' });
  }
  const qty = Number(quantity) || 1;
  if (qty < 1) return res.status(400).json({ message: 'Quantity must be >= 1' });

  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) cart = new Cart({ user: req.userId, items: [] });

  // For size-based products (like shoes), match by both productId AND size
  // For non-size products, match only by productId
  const idx = cart.items.findIndex(i => {
    const productMatch = i.product.toString() === productId;
    if (size) {
      return productMatch && i.size === size;
    }
    return productMatch && !i.size; // Match items without size
  });

  if (idx > -1) {
    cart.items[idx].quantity += qty;
  } else {
    cart.items.push({ product: productId, quantity: qty, size: size || undefined });
  }

  await cart.save();
  
  // Manually populate products from all collections
  const populatedItems = await populateCartItems(cart.items);
  
  res.json({
    ...cart.toObject(),
    items: populatedItems,
  });
});

// DELETE /api/cart/remove/:id -> remove by productId, optionally with size query param
router.delete('/remove/:id', auth, async (req, res) => {
  const { id: productId } = req.params;
  const { size } = req.query; // Optional size parameter
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid productId' });
  }

  const cart = await Cart.findOne({ user: req.userId });
  if (!cart) return res.json({ user: req.userId, items: [] });

  // If size is provided, remove only items with matching productId AND size
  // Otherwise, remove all items with matching productId (backward compatibility)
  if (size) {
    cart.items = cart.items.filter(i => 
      !(i.product.toString() === productId && i.size === size)
    );
  } else {
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
  }
  
  await cart.save();
  
  // Manually populate products from all collections
  const populatedItems = await populateCartItems(cart.items);
  
  res.json({
    ...cart.toObject(),
    items: populatedItems,
  });
});

// PUT /api/cart/update -> update quantity by productId and optionally size
router.put('/update', auth, async (req, res) => {
  const { productId, quantity, size } = req.body || {};
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid productId' });
  }
  const qty = Number(quantity);
  if (isNaN(qty) || qty < 1) {
    return res.status(400).json({ message: 'Quantity must be >= 1' });
  }

  const cart = await Cart.findOne({ user: req.userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  // Find item by productId and optionally size
  const idx = cart.items.findIndex(i => {
    const productMatch = i.product.toString() === productId;
    if (size !== undefined && size !== null) {
      return productMatch && i.size === size;
    }
    return productMatch && !i.size;
  });

  if (idx === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  cart.items[idx].quantity = qty;
  await cart.save();
  
  // Manually populate products from all collections
  const populatedItems = await populateCartItems(cart.items);
  
  res.json({
    ...cart.toObject(),
    items: populatedItems,
  });
});

export default router;
