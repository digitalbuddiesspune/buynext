/**
 * Shared category filters for GET /products — keep nav counts in sync with product listing.
 */

export const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const buildLooseCategoryRegex = (value = '') => {
  const normalized = value.toString().trim().toLowerCase();
  if (!normalized) return null;
  const pattern = normalized
    .replace(/&/g, ' and ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((part) => (part === 'and' ? '(?:and|&)' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    .join('\\s*');
  return new RegExp(`^${pattern}$`, 'i');
};

/**
 * @param {string} rawMain - mainCategory query value (e.g. from ProductList)
 * @param {string} rawCategory - category query value (sub slug segment style)
 * @param {string} rawSubCategory - optional third level
 * @returns {Record<string, unknown>} Mongoose filter ({} = no category constraints)
 */
export function buildProductCategoryAndFilter(rawMain, rawCategory, rawSubCategory) {
  const rawM = (rawMain || '').toString();
  const rawC = (rawCategory || '').toString();
  const rawS = (rawSubCategory || '').toString();

  const mainSlug = slugify(rawM);
  const categorySlug = slugify(rawC);
  const subCategorySlug = slugify(rawS);
  const mainLooseRe = buildLooseCategoryRegex(rawM || mainSlug.replace(/-/g, ' '));
  const categoryLooseRe = buildLooseCategoryRegex(rawC || categorySlug.replace(/-/g, ' '));
  const subCategoryLooseRe = buildLooseCategoryRegex(rawS || subCategorySlug.replace(/-/g, ' '));

  const andConditions = [];
  if (mainSlug) {
    andConditions.push({
      $or: [
        { 'taxonomy.mainCategorySlug': mainSlug },
        { category: { $regex: new RegExp(`^${rawM}$`, 'i') } },
        { category: { $regex: new RegExp(mainSlug.replace(/-/g, ' '), 'i') } },
        { Category: { $regex: new RegExp(`^${rawM}$`, 'i') } },
        { Category: { $regex: new RegExp(mainSlug.replace(/-/g, ' '), 'i') } },
        ...(mainLooseRe ? [{ category: { $regex: mainLooseRe } }, { Category: { $regex: mainLooseRe } }] : []),
      ],
    });
  }

  if (categorySlug) {
    andConditions.push({
      $or: [
        { 'taxonomy.subCategorySlug': categorySlug },
        { subcategory: { $regex: new RegExp(`^${rawC}$`, 'i') } },
        { category: { $regex: new RegExp(`^${rawC}$`, 'i') } },
        { 'Sub-Category': { $regex: new RegExp(`^${rawC}$`, 'i') } },
        ...(categoryLooseRe
          ? [
              { subcategory: { $regex: categoryLooseRe } },
              { category: { $regex: categoryLooseRe } },
              { 'Sub-Category': { $regex: categoryLooseRe } },
            ]
          : []),
      ],
    });
  }

  if (subCategorySlug) {
    andConditions.push({
      $or: [
        { 'taxonomy.subSubCategorySlug': subCategorySlug },
        { subSubCategory: { $regex: new RegExp(`^${rawS}$`, 'i') } },
        { subcategory: { $regex: new RegExp(`^${rawS}$`, 'i') } },
        { 'Sub-sub-Category': { $regex: new RegExp(`^${rawS}$`, 'i') } },
        ...(subCategoryLooseRe
          ? [
              { subSubCategory: { $regex: subCategoryLooseRe } },
              { subcategory: { $regex: subCategoryLooseRe } },
              { 'Sub-sub-Category': { $regex: subCategoryLooseRe } },
            ]
          : []),
      ],
    });
  }

  return andConditions.length > 0 ? { $and: andConditions } : {};
}

/** Admin catalog — only Beauty & Hygiene main category */
export const BEAUTY_HYGIENE_MAIN = 'Beauty & Hygiene';

const BEAUTY_HYGIENE_REGEX = '^beauty\\s*(?:&|and)\\s*hygiene$';

/** Match main category on Blinkit `Category` / normalized `category` / taxonomy fields */
export function buildAdminBeautyHygieneFilter() {
  const looseMainMatch = (fieldPath) => ({
    $expr: {
      $regexMatch: {
        input: { $toLower: { $ifNull: [fieldPath, ''] } },
        regex: BEAUTY_HYGIENE_REGEX,
      },
    },
  });

  return {
    $or: [
      looseMainMatch('$Category'),
      looseMainMatch('$category'),
      looseMainMatch('$taxonomy.mainCategory'),
      { 'taxonomy.mainCategorySlug': { $in: ['beauty-hygiene', 'beauty-and-hygiene'] } },
    ],
  };
}

/** Optional sub-category filter for admin (Blinkit `Sub-Category` or normalized subcategory) */
export function buildAdminBeautySubcategoryFilter(rawSubCategory = '') {
  const sub = rawSubCategory.toString().trim();
  if (!sub) return buildAdminBeautyHygieneFilter();

  const subLooseRe = buildLooseCategoryRegex(sub);
  const subSlug = slugify(sub);

  return {
    $and: [
      buildAdminBeautyHygieneFilter(),
      {
        $or: [
          { $expr: { $regexMatch: { input: { $toLower: { $ifNull: ['$Sub-Category', ''] } }, regex: subLooseRe.source, options: 'i' } } },
          { $expr: { $regexMatch: { input: { $toLower: { $ifNull: ['$subcategory', ''] } }, regex: subLooseRe.source, options: 'i' } } },
          { 'taxonomy.subCategorySlug': subSlug },
          { 'taxonomy.subCategory': { $regex: subLooseRe } },
        ],
      },
    ],
  };
}
