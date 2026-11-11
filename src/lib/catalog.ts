import { SIZE_ORDER } from "./constants";
import type { CategoryId, ColorId, Product, SortKey } from "./types";

export interface CatalogFilters {
  categories: CategoryId[];
  colors: ColorId[];
  sizes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortKey;
}

export const SORT_KEYS: readonly SortKey[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "rating",
];

export const isSortKey = (value: string): value is SortKey =>
  (SORT_KEYS as readonly string[]).includes(value);

/** Featured order rewards bestsellers and new arrivals, then rating. */
function featuredScore(p: Product): number {
  return (
    (p.tags.includes("bestseller") ? 2 : 0) + (p.tags.includes("new") ? 1.5 : 0) + p.rating / 5
  );
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => featuredScore(b) - featuredScore(a),
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

export function filterProducts(products: readonly Product[], f: CatalogFilters): Product[] {
  return products
    .filter((p) => {
      if (f.categories.length && !f.categories.includes(p.category)) return false;
      if (f.colors.length && !p.colors.some((c) => f.colors.includes(c))) return false;
      if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s))) return false;
      if (f.minPrice !== null && p.price < f.minPrice) return false;
      if (f.maxPrice !== null && p.price > f.maxPrice) return false;
      return true;
    })
    .sort(sorters[f.sort]);
}

export function priceBounds(products: readonly Product[]): [number, number] {
  if (!products.length) return [0, 0];
  const prices = products.map((p) => p.price);
  return [Math.floor(Math.min(...prices) / 10) * 10, Math.ceil(Math.max(...prices) / 10) * 10];
}

export function availableSizes(products: readonly Product[]): string[] {
  const present = new Set(products.flatMap((p) => p.sizes));
  return SIZE_ORDER.filter((s) => present.has(s));
}

export function availableColors(products: readonly Product[]): ColorId[] {
  return [...new Set(products.flatMap((p) => p.colors))];
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f\u064b-\u065f]/g, "")
    .trim();

/**
 * Ranks products against a free-text query in either language. Every term must
 * match somewhere; name matches outrank description matches.
 */
export function searchProducts(
  products: readonly Product[],
  query: string,
  extraTerms: (p: Product) => string[] = () => [],
): Product[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const scored: { product: Product; score: number }[] = [];
  for (const p of products) {
    const name = normalize(`${p.name.en} ${p.name.ar}`);
    const meta = normalize(
      [p.category, ...p.colors, p.material.en, p.material.ar, ...extraTerms(p)].join(" "),
    );
    const body = normalize(`${p.description.en} ${p.description.ar}`);
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      if (name.includes(term)) score += 3;
      else if (meta.includes(term)) score += 2;
      else if (body.includes(term)) score += 1;
      else {
        matchedAll = false;
        break;
      }
    }
    if (matchedAll) scored.push({ product: p, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.product);
}

export function relatedProducts(products: readonly Product[], product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/** Photos for a specific colour, falling back to the product's default shots. */
export function imagesForColor(product: Product, color: ColorId): string[] {
  return product.colorImages?.[color] ?? product.images;
}
