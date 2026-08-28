import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const hasToken = () => Boolean(localStorage.getItem('auth_token'));

  const mapServerCartToUI = useCallback((data) => {
    const parseRupeeToNumber = (value) => {
      if (typeof value === 'number') return value;
      if (!value) return 0;
      const numeric = String(value).replace(/[^0-9.]/g, '');
      const parsed = Number(numeric);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const items = data?.items || [];
    return items.map((i) => {
      const p = (typeof i.product === 'object' && i.product !== null) ? i.product : {};
      const productId = p._id || p.id || i.product || i.id;
      const title = p.title || p.name || p['SKU Name'] || p['Product Name'] || p.skuName || i.name || 'Product';
      
      let normalizedMrp = typeof p.mrp === 'number' && p.mrp > 0 ? p.mrp : parseRupeeToNumber(p['MRP'] || p.mrp);
      let price = typeof p.price === 'number' && p.price > 0 ? p.price : (normalizedMrp > 0 ? Math.round(normalizedMrp) : (typeof i.price === 'number' && i.price > 0 ? i.price : 0));
      if (!price || price <= 0) {
        price = 149;
      }
      if (!normalizedMrp || normalizedMrp <= 0) {
        normalizedMrp = price;
      }
      
      let imageUrl = null;
      if (p.images && typeof p.images === 'object' && !Array.isArray(p.images)) {
        imageUrl = p.images.image1 || p.images.image2 || p.images.image3 || p.images.url || null;
      } else if (Array.isArray(p.images) && p.images.length > 0) {
        const firstImg = p.images[0];
        if (typeof firstImg === 'string' && firstImg.trim() !== '') {
          imageUrl = firstImg.trim();
        } else if (firstImg?.url && typeof firstImg.url === 'string' && firstImg.url.trim() !== '') {
          imageUrl = firstImg.url.trim();
        }
      }
      
      if (!imageUrl && p['Image Link']) imageUrl = p['Image Link'];
      if (!imageUrl && p.image) imageUrl = typeof p.image === 'string' ? p.image : p.image?.url;
      if (!imageUrl && p.imageUrl) imageUrl = p.imageUrl;
      if (!imageUrl && p.imageLink) imageUrl = p.imageLink;
      if (!imageUrl && p.sourceData?.imageLink) imageUrl = p.sourceData.imageLink;
      if (!imageUrl && i.image) imageUrl = typeof i.image === 'string' ? i.image : i.image?.url;

      if (imageUrl && typeof imageUrl === 'string') {
        imageUrl = imageUrl.trim();
      }
      
      return {
        id: productId,
        _id: productId,
        name: title,
        title: title,
        image: imageUrl,
        images: p.images || { image1: imageUrl },
        material: p.product_info?.fabric || p.product_info?.material || p.product_info?.shoeMaterial || p.product_info?.SareeMaterial,
        work: p.product_info?.includedComponents || p.product_info?.IncludedComponents,
        price,
        originalPrice: normalizedMrp || p.originalPrice || price,
        quantity: i.quantity || 1,
        size: i.size || null,
      };
    });
  }, []);

  const loadCart = useCallback(async () => {
    if (!hasToken()) {
      setCart([]);
      return;
    }
    try {
      const data = await api.getCart();
      setCart(mapServerCartToUI(data));
    } catch (error) {
      // Handle 401 (Unauthorized) or invalid token errors gracefully
      if (error.status === 401 || error.message?.includes('Invalid token') || error.message?.includes('Unauthorized')) {
        // Token is invalid, clear cart and optionally clear the invalid token
        setCart([]);
        // Optionally clear invalid token
        try {
          localStorage.removeItem('auth_token');
        } catch (e) {
          // Ignore localStorage errors
        }
      } else {
        // For other errors, just log them but don't break the app
        console.error('Error loading cart:', error);
        setCart([]);
      }
    }
  }, [mapServerCartToUI]);

  const requireAuth = useCallback(() => {
    if (!hasToken()) {
      alert('Please login to access your cart');
      navigate('/signin', { state: { from: location }, replace: true });
      return false;
    }
    return true;
  }, [navigate, location]);

  const addToCart = useCallback(async (productIdOrObj, quantity = 1, size = null) => {
    if (!requireAuth()) return;
    // Accept either productId or a product object
    let productId = productIdOrObj;
    if (typeof productIdOrObj === 'object' && productIdOrObj) {
      productId = productIdOrObj._id || productIdOrObj.id;
    }
    try {
      await api.addToCart({ productId, quantity, size });
      await loadCart();
    } catch (error) {
      // Handle 401 (Unauthorized) - token is invalid
      if (error.status === 401 || error.message?.includes('Invalid token') || error.message?.includes('Unauthorized')) {
        // Clear invalid token and redirect to login
        try {
          localStorage.removeItem('auth_token');
        } catch (e) {
          // Ignore localStorage errors
        }
        alert('Your session has expired. Please login again.');
        navigate('/signin', { state: { from: location }, replace: true });
        throw error; // Re-throw to let the caller handle it
      }
      throw error; // Re-throw other errors
    }
  }, [requireAuth, loadCart, navigate, location]);

  const removeFromCart = useCallback(async (productId, size = null) => {
    if (!requireAuth()) return;
    await api.removeFromCart(productId, size);
    await loadCart();
  }, [requireAuth, loadCart]);

  const updateQuantity = useCallback(async (productId, newQuantity, size = null) => {
    if (!requireAuth()) return;
    if (newQuantity < 1) {
      // Pass size when removing so it removes the correct item
      if (size) {
        await api.removeFromCart(productId, size);
      } else {
        await removeFromCart(productId);
      }
      return;
    }
    
    // Use update endpoint to preserve size
    try {
      await api.updateCartQuantity({ productId, quantity: newQuantity, size });
      await loadCart();
    } catch (error) {
      // Fallback to old method if update endpoint doesn't exist
      const current = cart.find(i => i.id === productId && (!size || i.size === size))?.quantity || 0;
      const delta = newQuantity - current;
      if (delta === 0) return;
      if (delta > 0) {
        await api.addToCart({ productId, quantity: delta, size });
        await loadCart();
      } else {
        // Simulate decrement: remove then add desired quantity with size
        if (size) {
          await api.removeFromCart(productId, size);
          await api.addToCart({ productId, quantity: newQuantity, size });
        } else {
          await api.removeFromCart(productId);
          await api.addToCart({ productId, quantity: newQuantity });
        }
        await loadCart();
      }
    }
  }, [requireAuth, removeFromCart, cart, loadCart]);

  const clearCart = useCallback(async () => {
    // No dedicated clear endpoint; remove each item
    if (!requireAuth()) return;
    for (const item of cart) {
      await api.removeFromCart(item.id);
    }
    await loadCart();
  }, [requireAuth, cart, loadCart]);

  const cartTotal = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    loadCart();
    const onStorage = (e) => {
      if (!e || e.key === 'auth_token') loadCart();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [loadCart]);

  // Also reload on route changes to reflect auth changes in the same tab
  useEffect(() => {
    loadCart();
  }, [location.pathname, loadCart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      loadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
