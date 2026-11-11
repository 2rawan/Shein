export type Locale = "en" | "ar";

export type Localized = Record<Locale, string>;

export type CategoryId =
  "outerwear" | "dresses" | "tops" | "knitwear" | "bottoms" | "shoes" | "bags" | "accessories";

export type ColorId =
  | "black"
  | "ivory"
  | "white"
  | "camel"
  | "olive"
  | "indigo"
  | "navy"
  | "rust"
  | "burgundy"
  | "red"
  | "plum"
  | "chambray"
  | "saffron"
  | "grey"
  | "brown"
  | "tan"
  | "blush"
  | "sage"
  | "stone"
  | "gold"
  | "silver"
  | "teal"
  | "oat";

export type ProductTag = "new" | "bestseller" | "limited";

export interface Product {
  id: string;
  name: Localized;
  category: CategoryId;
  price: number;
  compareAtPrice?: number;
  colors: ColorId[];
  sizes: string[];
  soldOutSizes?: string[];
  images: string[];
  /** Photos per colour; colours without an entry fall back to `images`. */
  colorImages?: Partial<Record<ColorId, string[]>>;
  description: Localized;
  material: Localized;
  rating: number;
  reviewCount: number;
  tags: ProductTag[];
  createdAt: string;
}

export interface CartLine {
  key: string;
  productId: string;
  color: ColorId;
  size: string;
  quantity: number;
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating";
