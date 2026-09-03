export const slugifyCategory = (value = '') =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/** Main category → subcategory only (Beauty & Hygiene). */
export const categoryTree = [
  {
    name: 'Beauty & Hygiene',
    subcategories: [
      { name: 'Bath & Hand Wash' },
      { name: 'Feminine Hygiene' },
      { name: 'Fragrances & Deos' },
      { name: 'Hair Care' },
      { name: 'Makeup' },
      { name: 'Oral Care' },
      { name: 'Skin Care' },
    ],
  },
];

const beautyMain = categoryTree[0];
const beautyMainSlug = slugifyCategory(beautyMain.name);

export const navbarCategories = beautyMain.subcategories.map((sub) => ({
  name: sub.name,
  path: `/category/${beautyMainSlug}/${slugifyCategory(sub.name)}`,
}));
