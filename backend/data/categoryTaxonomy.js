const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const categoryTaxonomy = [
  {
    name: 'Beauty & Hygiene',
    subcategories: [
      { name: 'Bath & Hand Wash', subSubcategories: ['Bath Salts & Oils', 'Bathing Accessories', 'Bathing Bars & Soaps', 'Body Scrubs & Exfoliants', 'Hand Wash & Sanitizers', 'Shower Gel & Body Wash', 'Talcum Powder'] },
      { name: 'Feminine Hygiene', subSubcategories: ['Hair Removal', 'Intimate Wash & Care', 'Panty Liners', 'Sanitary Napkins', 'Tampons & Menstrual Cups'] },
      { name: 'Fragrances & Deos', subSubcategories: ['Attar', 'Body Sprays & Mists', 'Eau De Cologne', 'Eau De Parfum', 'Eau De Toilette', 'Gift Sets', "Men's Deodorants", "Women's Deodorants", 'Perfume'] },
      { name: 'Hair Care', subSubcategories: ['Dry Shampoo & Conditioner', 'Hair & Scalp Treatment', 'Hair Color', 'Hair Oil & Serum', 'Hair Styling', 'Shampoo & Conditioner', 'Tools & Accessories'] },
      { name: 'Health & Medicine', subSubcategories: ['Antiseptics & Bandages', 'Cotton & Ear Buds', 'Devices', 'Everyday Medicine', 'Face Masks & Safety Gears', 'Sexual Wellness', 'Slimming Products', 'Supplements & Proteins'] },
      { name: 'Makeup', subSubcategories: ['Eyes', 'Face', 'Lips', 'Makeup Accessories', 'Makeup Kits & Gift Sets', 'Nails'] },
      { name: "Men's Grooming", subSubcategories: ['Bath & Shower', 'Combos & Gift Sets', 'Deodorant', 'Face & Body', 'Hair Care & Styling', 'Moustache & Beard Care', 'Shaving Care', 'Talc'] },
      { name: 'Oral Care', subSubcategories: [] },
      { name: 'Skin Care', subSubcategories: ['Aromatherapy', 'Body Care', 'Eye Care', 'Face Care', 'Lip Care'] },
    ],
  },
];

export const flattenedTaxonomy = categoryTaxonomy.flatMap((main) => {
  const mainSlug = slugify(main.name);
  const mainNode = [{ name: main.name, slug: mainSlug, level: 'main', parentSlug: null }];
  const subNodes = main.subcategories.map((sub) => ({
    name: sub.name,
    slug: slugify(sub.name),
    level: 'sub',
    parentSlug: mainSlug,
  }));
  const itemNodes = main.subcategories.flatMap((sub) =>
    sub.subSubcategories.map((item) => ({
      name: item,
      slug: slugify(item),
      level: 'leaf',
      parentSlug: slugify(sub.name),
      rootSlug: mainSlug,
    }))
  );
  return [...mainNode, ...subNodes, ...itemNodes];
});
