import mongoose from "mongoose";

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const parseRupeeValue = (value) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const numeric = String(value).replace(/[^0-9.]/g, "");
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
};

const productSchema = new mongoose.Schema(
  {
    title: { type: String },
    mrp: { type: Number },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    description: { type: String },
    category: { type: String, index: true },
    subcategory: { type: String, default: "", index: true },
    subSubCategory: { type: String, default: "", index: true },
    categoryId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      index: true 
    },
    taxonomy: {
      mainCategory: { type: String, default: "", index: true },
      mainCategorySlug: { type: String, default: "", index: true },
      subCategory: { type: String, default: "", index: true },
      subCategorySlug: { type: String, default: "", index: true },
      subSubCategory: { type: String, default: "", index: true },
      subSubCategorySlug: { type: String, default: "", index: true },
    },
    sourceData: {
      source: { type: String, default: "manual" },
      productLink: { type: String, default: "" },
      eanCode: { type: String, default: "", index: true },
      skuName: { type: String, default: "" },
      skuSize: { type: String, default: "" },
      imageLink: { type: String, default: "" },
      aboutProduct: { type: String, default: "" },
      raw: { type: mongoose.Schema.Types.Mixed, default: null },
    },

    product_info: {
      brand: { type: String },
      manufacturer: { type: String },
      availableSizes: { type: [String], default: [] },
      shoeSize: { type: String },
      shoeMaterial: { type: String },
      shoeColor: { type: String },
      shoeType: { type: String },
      watchBrand: { type: String },
      movementType: { type: String },
      caseMaterial: { type: String },
      bandMaterial: { type: String },
      waterResistance: { type: String },
      watchType: { type: String },
      IncludedComponents: { type: String },
    },

    images: {
      image1: { type: String },
      image2: { type: String },
      image3: { type: String },
    },
  },
  {
    strict: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: Final price to display
productSchema.virtual("price").get(function () {
  const val = this.mrp ?? this.get("MRP") ?? this._doc?.["MRP"] ?? this.sourceData?.raw?.MRP;
  return parseRupeeValue(val);
});

productSchema.post("init", function (doc) {
  if (!doc.title && (doc._doc?.["SKU Name"] || doc.get("SKU Name"))) {
    doc.title = doc._doc?.["SKU Name"] || doc.get("SKU Name");
  }
  if ((!doc.mrp || Number.isNaN(Number(doc.mrp))) && (doc._doc?.["MRP"] || doc.get("MRP"))) {
    doc.mrp = parseRupeeValue(doc._doc?.["MRP"] || doc.get("MRP"));
  }
  if (!doc.description && (doc._doc?.["About the Product"] || doc.get("About the Product"))) {
    doc.description = doc._doc?.["About the Product"] || doc.get("About the Product");
  }
  if (!doc.images) doc.images = {};
  if (!doc.images.image1 && (doc._doc?.["Image Link"] || doc.get("Image Link"))) {
    doc.images.image1 = doc._doc?.["Image Link"] || doc.get("Image Link");
  }
  if (!doc.category && (doc._doc?.["Category"] || doc.get("Category"))) {
    doc.category = doc._doc?.["Category"] || doc.get("Category");
  }
  if (!doc.subcategory && (doc._doc?.["Sub-Category"] || doc.get("Sub-Category"))) {
    doc.subcategory = doc._doc?.["Sub-Category"] || doc.get("Sub-Category");
  }
  if (!doc.product_info) doc.product_info = {};
  if (!doc.product_info.brand && (doc._doc?.["Brand"] || doc.get("Brand"))) {
    doc.product_info.brand = doc._doc?.["Brand"] || doc.get("Brand");
  }
});

productSchema.pre("validate", function setDatasetDerivedFields(next) {
  if (!this.mrp && this.get("MRP")) {
    this.mrp = parseRupeeValue(this.get("MRP"));
  } else {
    this.mrp = parseRupeeValue(this.mrp);
  }

  if (!this.description && (this.sourceData?.aboutProduct || this.get("About the Product"))) {
    this.description = this.sourceData?.aboutProduct || this.get("About the Product");
  }

  if (!this.title && (this.sourceData?.skuName || this.get("SKU Name"))) {
    this.title = this.sourceData?.skuName || this.get("SKU Name");
  }

  if (!this.category && (this.taxonomy?.mainCategory || this.get("Category"))) {
    this.category = this.taxonomy?.mainCategory || this.get("Category");
  }
  if (!this.subcategory && (this.taxonomy?.subCategory || this.get("Sub-Category"))) {
    this.subcategory = this.taxonomy?.subCategory || this.get("Sub-Category");
  }

  if (!this.taxonomy) this.taxonomy = {};
  this.taxonomy.mainCategorySlug = slugify(this.taxonomy.mainCategory || this.category || "");
  this.taxonomy.subCategorySlug = slugify(this.taxonomy.subCategory || this.subcategory || "");
  this.taxonomy.subSubCategorySlug = slugify(this.taxonomy.subSubCategory || this.subSubCategory || "");

  if (!this.images) this.images = {};
  if (!this.images.image1 && (this.sourceData?.imageLink || this.get("Image Link"))) {
    this.images.image1 = this.sourceData?.imageLink || this.get("Image Link");
  }

  next();
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
