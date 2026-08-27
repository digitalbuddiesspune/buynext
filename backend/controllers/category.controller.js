import { Category } from '../models/Category.js';
import { Product } from '../models/product.js';
import { categoryTaxonomy, flattenedTaxonomy } from '../data/categoryTaxonomy.js';
import { navCategoryTree } from '../data/navCategoryTree.js';
import { slugify, buildProductCategoryAndFilter } from '../utils/productCategoryFilter.js';

/** Match ProductList URL segments → API query params */
function mainCategoryQueryParamFromSlug(mainSlug) {
  return mainSlug
    .replace(/-/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function subCategoryQueryParamFromSlug(subSlug) {
  const title = subSlug
    .replace(/-/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return title.toLowerCase().replace(/\s+/g, '-');
}

async function countListedProductsForSubcategory(rawMain, rawCategorySlug) {
  const base = buildProductCategoryAndFilter(rawMain, rawCategorySlug, '');
  if (!base.$and?.length) return 0;
  return Product.collection.countDocuments({
    $and: [
      ...base.$and,
      {
        $or: [
          { mrp: { $gt: 0 } },
          { MRP: { $ne: null, $exists: true } },
          { Price: { $ne: null, $exists: true } },
        ],
      },
    ],
  });
}

async function countListedProductsForMainOnly(rawMain) {
  const base = buildProductCategoryAndFilter(rawMain, '', '');
  if (!base.$and?.length) return 0;
  return Product.collection.countDocuments({
    $and: [
      ...base.$and,
      {
        $or: [
          { mrp: { $gt: 0 } },
          { MRP: { $ne: null, $exists: true } },
          { Price: { $ne: null, $exists: true } },
        ],
      },
    ],
  });
}

// Get all categories with subcategories
export const getAllCategories = async (req, res) => {
  try {
    // Get all parent categories (where parentId is null)
    const parentCategories = await Category.find({ parentId: null, active: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Get all subcategories
    const subcategories = await Category.find({ parentId: { $ne: null }, active: true })
      .populate('parentId', 'name slug')
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Group subcategories by parentId
    const subcategoriesByParent = {};
    subcategories.forEach(sub => {
      const parentId = sub.parentId ? String(sub.parentId._id || sub.parentId) : String(sub.parentId);
      if (!subcategoriesByParent[parentId]) {
        subcategoriesByParent[parentId] = [];
      }
      subcategoriesByParent[parentId].push(sub);
    });

    // Combine parent categories with their subcategories
    const categoriesWithSubs = parentCategories.map(parent => ({
      ...parent,
      subcategories: subcategoriesByParent[String(parent._id)] || []
    }));

    // Return all categories (parents with subs) and flat list.
    // If DB has no category setup yet, fallback to code taxonomy.
    if (parentCategories.length === 0) {
      return res.json({
        categories: categoryTaxonomy.map((main) => ({
          _id: `main-${main.name}`,
          name: main.name,
          slug: main.name.toLowerCase().replace(/&/g, ' and ').replace(/\s+/g, '-'),
          subcategories: main.subcategories.map((sub) => ({
            _id: `sub-${main.name}-${sub.name}`,
            name: sub.name,
            slug: sub.name.toLowerCase().replace(/&/g, ' and ').replace(/\s+/g, '-'),
            subSubcategories: sub.subSubcategories,
          })),
        })),
        allCategories: flattenedTaxonomy,
      });
    }

    return res.json({
      categories: categoriesWithSubs,
      allCategories: [
        ...parentCategories,
        ...subcategories
      ].sort((a, b) => {
        // Sort by name
        return a.name.localeCompare(b.name);
      })
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};

/**
 * Nav menu: only main categories and subcategories that have at least one product (mrp > 0).
 * Shape matches frontend `navbarCategories`: { name, path, subcategories: [{ name, path }] }.
 */
export const getNavCategoriesWithProducts = async (req, res) => {
  try {
    const categories = [];

    for (const main of navCategoryTree) {
      const mainSlug = slugify(main.name);
      const rawMain = mainCategoryQueryParamFromSlug(mainSlug);

      const subResults = await Promise.all(
        main.subcategories.map(async (sub) => {
          const subSlug = slugify(sub.name);
          const rawCategory = subCategoryQueryParamFromSlug(subSlug);
          const count = await countListedProductsForSubcategory(rawMain, rawCategory);
          if (count < 1) return null;
          return {
            name: sub.name,
            path: `/category/${mainSlug}/${subSlug}`,
          };
        })
      );

      const subcategories = subResults.filter(Boolean);
      const mainOnlyCount = await countListedProductsForMainOnly(rawMain);
      if (subcategories.length === 0 && mainOnlyCount === 0) continue;

      categories.push({
        name: main.name,
        path: `/category/${mainSlug}`,
        subcategories,
      });
    }

    return res.json({ categories });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to build nav categories', error: err.message });
  }
};
