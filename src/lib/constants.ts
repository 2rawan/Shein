import type { CategoryId, ColorId, Localized } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  name: Localized;
  /** Editorial image used in the home index and shop header. */
  image: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const CATEGORIES: readonly CategoryMeta[] = [
  {
    id: "outerwear",
    name: { en: "Outerwear", ar: "ملابس خارجية" },
    image: unsplash("1539533018447-63fcce2678e3"),
  },
  {
    id: "dresses",
    name: { en: "Dresses", ar: "فساتين" },
    image: unsplash("1595777457583-95e059d581b8"),
  },
  {
    id: "tops",
    name: { en: "Shirts & Tops", ar: "قمصان وبلوزات" },
    image: unsplash("1588359348347-9bc6cbbb689e"),
  },
  {
    id: "knitwear",
    name: { en: "Knitwear", ar: "تريكو" },
    image: unsplash("1631541909061-71e349d1f203"),
  },
  {
    id: "bottoms",
    name: { en: "Trousers & Denim", ar: "بناطيل وجينز" },
    image: unsplash("1624378439575-d8705ad7ae80"),
  },
  {
    id: "shoes",
    name: { en: "Shoes", ar: "أحذية" },
    image: unsplash("1608256246200-53e635b5b65f"),
  },
  {
    id: "bags",
    name: { en: "Bags", ar: "حقائب" },
    image: unsplash("1584917865442-de89df76afd3"),
  },
  {
    id: "accessories",
    name: { en: "Jewellery & Accessories", ar: "مجوهرات وإكسسوارات" },
    image: unsplash("1590548784585-643d2b9f2925"),
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  CategoryMeta
>;

export const isCategoryId = (value: string): value is CategoryId => value in CATEGORY_BY_ID;

export interface ColorMeta {
  id: ColorId;
  name: Localized;
  hex: string;
}

export const COLORS: readonly ColorMeta[] = [
  { id: "black", name: { en: "Black", ar: "أسود" }, hex: "#1d1c1a" },
  { id: "ivory", name: { en: "Ivory", ar: "عاجي" }, hex: "#efe8da" },
  { id: "white", name: { en: "White", ar: "أبيض" }, hex: "#fbfaf7" },
  { id: "oat", name: { en: "Oat", ar: "شوفاني" }, hex: "#d8cbb4" },
  { id: "stone", name: { en: "Stone", ar: "حجري" }, hex: "#b9ad99" },
  { id: "camel", name: { en: "Camel", ar: "جملي" }, hex: "#b0814f" },
  { id: "tan", name: { en: "Tan", ar: "بيج داكن" }, hex: "#a87449" },
  { id: "brown", name: { en: "Chocolate", ar: "بني" }, hex: "#5a3a26" },
  { id: "rust", name: { en: "Rust", ar: "صدئي" }, hex: "#a4532f" },
  { id: "saffron", name: { en: "Saffron", ar: "زعفراني" }, hex: "#e0a135" },
  { id: "red", name: { en: "Red", ar: "أحمر" }, hex: "#b3261e" },
  { id: "burgundy", name: { en: "Burgundy", ar: "عنابي" }, hex: "#6b2232" },
  { id: "plum", name: { en: "Plum", ar: "برقوقي" }, hex: "#5b2148" },
  { id: "blush", name: { en: "Blush", ar: "وردي فاتح" }, hex: "#e3b9ad" },
  { id: "sage", name: { en: "Sage", ar: "مريمي" }, hex: "#8e9a7e" },
  { id: "olive", name: { en: "Olive", ar: "زيتي" }, hex: "#5d5b3a" },
  { id: "teal", name: { en: "Teal", ar: "أزرق مخضر" }, hex: "#1f5f62" },
  { id: "chambray", name: { en: "Chambray", ar: "أزرق فاتح" }, hex: "#8fa6c2" },
  { id: "indigo", name: { en: "Indigo", ar: "نيلي" }, hex: "#2c3a57" },
  { id: "navy", name: { en: "Navy", ar: "كحلي" }, hex: "#1e2638" },
  { id: "grey", name: { en: "Grey", ar: "رمادي" }, hex: "#9a9893" },
  { id: "gold", name: { en: "Gold", ar: "ذهبي" }, hex: "#c9a35b" },
  { id: "silver", name: { en: "Silver", ar: "فضي" }, hex: "#c8c8c4" },
];

export const COLOR_BY_ID = Object.fromEntries(COLORS.map((c) => [c.id, c])) as Record<
  ColorId,
  ColorMeta
>;

export const isColorId = (value: string): value is ColorId => value in COLOR_BY_ID;

/** Canonical display order for sizes across apparel, shoes and one-size goods. */
export const SIZE_ORDER = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "One size",
] as const;

export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_RATES = { standard: 12, express: 28 } as const;
export type ShippingMethod = keyof typeof SHIPPING_RATES;
