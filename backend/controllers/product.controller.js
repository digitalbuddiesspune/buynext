import { Product } from '../models/product.js';
import {
  buildProductCategoryAndFilter,
  slugify,
  buildLooseCategoryRegex,
} from '../utils/productCategoryFilter.js';

const parseRupeeToNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = String(value).replace(/[^0-9.]/g, '');
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getProducts = async (req, res) => {
  try {
    const rawMain = (req.query.mainCategory || req.query.main || req.query.rootCategory || '').toString();
    const rawCategory = (req.query.category || '').toString();
    const rawSubCategory = (req.query.subcategory || req.query.subCategory || req.query.subSubCategory || '').toString();

    const query = buildProductCategoryAndFilter(rawMain, rawCategory, rawSubCategory);
    const mainSlug = slugify(rawMain);
    const categorySlug = slugify(rawCategory);
    const subCategorySlug = slugify(rawSubCategory);
    const mainLooseRe = buildLooseCategoryRegex(rawMain || mainSlug.replace(/-/g, ' '));
    const categoryLooseRe = buildLooseCategoryRegex(rawCategory || categorySlug.replace(/-/g, ' '));
    const subCategoryLooseRe = buildLooseCategoryRegex(rawSubCategory || subCategorySlug.replace(/-/g, ' '));

    const parsedLimit = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 0;

    // Use _id sort (indexed by default) to avoid in-memory sort limit errors.
    let productsQuery = Product.find(query).sort({ _id: -1 });
    if (limit) productsQuery = productsQuery.limit(limit);
    let products = await productsQuery;

    // Fallback for manually inserted raw dataset docs:
    // if strict 3-level match returns no rows, try relaxed leaf match.
    if (products.length === 0 && (subCategoryLooseRe || rawSubCategory)) {
      const leafRegex = subCategoryLooseRe || new RegExp(rawSubCategory, 'i');
      let leafQuery = Product.find({
        $or: [
          { 'taxonomy.subSubCategorySlug': subCategorySlug },
          { subSubCategory: { $regex: leafRegex } },
          { subcategory: { $regex: leafRegex } },
          { 'Sub-sub-Category': { $regex: leafRegex } },
          { 'Sub-Category': { $regex: leafRegex } },
          { title: { $regex: leafRegex } },
          { 'SKU Name': { $regex: leafRegex } },
        ],
      }).sort({ _id: -1 });
      if (limit) leafQuery = leafQuery.limit(limit);
      products = await leafQuery;
    }

    // Native Mongo fallback for raw-key docs inserted directly via Compass.
    // This bypasses mongoose strict query/path filtering for keys like `Sub-Category`.
    if (products.length === 0) {
      const rawAnd = [];
      if (mainLooseRe) rawAnd.push({ Category: { $regex: mainLooseRe } });
      if (categoryLooseRe) rawAnd.push({ 'Sub-Category': { $regex: categoryLooseRe } });
      if (subCategoryLooseRe) rawAnd.push({ 'Sub-sub-Category': { $regex: subCategoryLooseRe } });

      const rawQuery = rawAnd.length > 0 ? { $and: rawAnd } : {};
      let rawCursor = Product.collection.find(rawQuery).sort({ _id: -1 });
      if (limit) rawCursor = rawCursor.limit(limit);
      products = await rawCursor.toArray();
    }

    // Process image URLs to ensure they're absolute
    products = products.map(product => {
      const productObj = typeof product?.toObject === 'function' ? product.toObject() : { ...product };

      // Normalize raw dataset-shaped documents into frontend shape.
      if (!productObj.title && productObj['SKU Name']) {
        productObj.title = productObj['SKU Name'];
      }
      if ((!productObj.mrp || Number.isNaN(Number(productObj.mrp))) && productObj['MRP']) {
        productObj.mrp = parseRupeeToNumber(productObj['MRP']);
      }
      if (!productObj.description && productObj['About the Product']) {
        productObj.description = productObj['About the Product'];
      }
      if (!productObj.category && productObj['Category']) {
        productObj.category = productObj['Category'];
      }
      if (!productObj.subcategory && productObj['Sub-Category']) {
        productObj.subcategory = productObj['Sub-Category'];
      }
      if (!productObj.subSubCategory && productObj['Sub-sub-Category']) {
        productObj.subSubCategory = productObj['Sub-sub-Category'];
      }
      if (!productObj.product_info) {
        productObj.product_info = {};
      }
      if (!productObj.product_info.brand && productObj['Brand']) {
        productObj.product_info.brand = productObj['Brand'];
      }
      if (!productObj.images) {
        productObj.images = {};
      }
      if (!productObj.images.image1 && productObj['Image Link']) {
        productObj.images.image1 = productObj['Image Link'];
      }
      // Get base URL from environment - use production URL or fallback to localhost for development
      const baseUrl = process.env.BASE_URL || 
                     process.env.BACKEND_URL || 
                     (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
      
      // Helper function to ensure URL is absolute
      const ensureAbsoluteUrl = (url) => {
        if (!url || typeof url !== 'string') return url;
        
        // Already absolute URL (http://, https://, or //)
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
          return url;
        }
        
        // Cloudinary or other CDN URLs (usually already absolute)
        if (url.includes('cloudinary.com') || url.includes('amazonaws.com') || url.includes('cdn')) {
          // If it's missing protocol, add https
          if (!url.startsWith('http')) {
            return `https://${url}`;
          }
          return url;
        }
        
        // Relative URL - prepend baseUrl only if baseUrl is set
        if (baseUrl) {
          return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
        }
        
        // If no baseUrl in production and relative URL, return as-is (assume same domain)
        return url;
      };
      
      // Handle both image structures: array of objects OR object with image1/image2/image3
      if (productObj.images) {
        if (Array.isArray(productObj.images)) {
          // Array structure - convert back to object format for frontend consistency
          const imagesObj = {};
          productObj.images.forEach((img, index) => {
            if (img && img.url) {
              imagesObj[`image${index + 1}`] = ensureAbsoluteUrl(img.url);
            }
          });
          // If array is empty but we have object structure, keep original
          if (Object.keys(imagesObj).length > 0) {
            productObj.images = imagesObj;
          }
        } else if (typeof productObj.images === 'object') {
          // Object structure with image1, image2, image3 - ensure URLs are absolute
          const processedImages = {};
          ['image1', 'image2', 'image3'].forEach(key => {
            if (productObj.images[key]) {
              processedImages[key] = ensureAbsoluteUrl(productObj.images[key]);
            }
          });
          productObj.images = processedImages;
        }
      }
      
      return productObj;
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Convert to plain object to modify
    const productObj = product.toObject();

    // Normalize raw dataset-shaped documents into frontend shape.
    if (!productObj.title && productObj['SKU Name']) {
      productObj.title = productObj['SKU Name'];
    }
    if ((!productObj.mrp || Number.isNaN(Number(productObj.mrp))) && productObj['MRP']) {
      productObj.mrp = parseRupeeToNumber(productObj['MRP']);
    }
    if (!productObj.description && productObj['About the Product']) {
      productObj.description = productObj['About the Product'];
    }
    if (!productObj.category && productObj['Category']) {
      productObj.category = productObj['Category'];
    }
    if (!productObj.subcategory && productObj['Sub-Category']) {
      productObj.subcategory = productObj['Sub-Category'];
    }
    if (!productObj.subSubCategory && productObj['Sub-sub-Category']) {
      productObj.subSubCategory = productObj['Sub-sub-Category'];
    }
    if (!productObj.product_info) {
      productObj.product_info = {};
    }
    if (!productObj.product_info.brand && productObj['Brand']) {
      productObj.product_info.brand = productObj['Brand'];
    }
    // Keep brand at root for existing UI checks
    if (!productObj.brand && (productObj['Brand'] || productObj.product_info?.brand)) {
      productObj.brand = productObj['Brand'] || productObj.product_info.brand;
    }
    if (!productObj.images) {
      productObj.images = {};
    }
    if (!productObj.images.image1 && productObj['Image Link']) {
      productObj.images.image1 = productObj['Image Link'];
    }
    
    // Get base URL from environment - use production URL or fallback to localhost for development
    const baseUrl = process.env.BASE_URL || 
                   process.env.BACKEND_URL || 
                   (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
    
    // Helper function to ensure URL is absolute
    const ensureAbsoluteUrl = (url) => {
      if (!url || typeof url !== 'string') return url;
      
      // Already absolute URL (http://, https://, or //)
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return url;
      }
      
      // Cloudinary or other CDN URLs (usually already absolute)
      if (url.includes('cloudinary.com') || url.includes('amazonaws.com') || url.includes('cdn')) {
        // If it's missing protocol, add https
        if (!url.startsWith('http')) {
          return `https://${url}`;
        }
        return url;
      }
      
      // Relative URL - prepend baseUrl only if baseUrl is set
      if (baseUrl) {
        return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
      }
      
      // If no baseUrl in production and relative URL, return as-is (assume same domain)
      return url;
    };
    
    // Process image URLs to ensure they're absolute and maintain object structure
    if (productObj.images) {
      if (Array.isArray(productObj.images)) {
        // Array structure - convert back to object format for frontend consistency
        const imagesObj = {};
        productObj.images.forEach((img, index) => {
          if (img && img.url) {
            imagesObj[`image${index + 1}`] = ensureAbsoluteUrl(img.url);
          }
        });
        if (Object.keys(imagesObj).length > 0) {
          productObj.images = imagesObj;
        }
      } else if (typeof productObj.images === 'object') {
        // Object structure with image1, image2, image3 - ensure URLs are absolute
        const processedImages = {};
        ['image1', 'image2', 'image3'].forEach(key => {
          if (productObj.images[key]) {
            processedImages[key] = ensureAbsoluteUrl(productObj.images[key]);
          }
        });
        productObj.images = processedImages;
      }
    }
    
    res.json(productObj);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      message: 'Error fetching product', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
