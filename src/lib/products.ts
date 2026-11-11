import type { Product } from "./types";

let cache: Product[] | null = null;
let pending: Promise<Product[]> | null = null;

/**
 * Loads the catalogue as a separate chunk, mimicking a network request so the
 * UI exercises its loading states. Results are cached for the session.
 */
export function loadProducts(): Promise<Product[]> {
  if (cache) return Promise.resolve(cache);
  pending ??= import("@/data/products.json").then((mod) => {
    cache = mod.default as Product[];
    return cache;
  });
  return pending;
}

export const getCachedProducts = (): Product[] | null => cache;
