import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { isSortKey, type CatalogFilters } from "@/lib/catalog";
import { isCategoryId, isColorId } from "@/lib/constants";

type ListKey = "category" | "color" | "size";

const parseNumber = (v: string | null) => {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Shop filters live in the URL so results are shareable and survive reloads. */
export function useShopFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<CatalogFilters>(() => {
    const sort = params.get("sort") ?? "";
    return {
      categories: params.getAll("category").filter(isCategoryId),
      colors: params.getAll("color").filter(isColorId),
      sizes: params.getAll("size"),
      minPrice: parseNumber(params.get("min")),
      maxPrice: parseNumber(params.get("max")),
      sort: isSortKey(sort) ? sort : "featured",
    };
  }, [params]);

  const update = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setParams],
  );

  const toggle = useCallback(
    (key: ListKey, value: string) => {
      update((next) => {
        const values = next.getAll(key);
        next.delete(key);
        const updated = values.includes(value)
          ? values.filter((v) => v !== value)
          : [...values, value];
        updated.forEach((v) => {
          next.append(key, v);
        });
      });
    },
    [update],
  );

  const setPrice = useCallback(
    (min: number | null, max: number | null) => {
      update((next) => {
        if (min === null) next.delete("min");
        else next.set("min", String(min));
        if (max === null) next.delete("max");
        else next.set("max", String(max));
      });
    },
    [update],
  );

  const setSort = useCallback(
    (sort: string) => {
      update((next) => {
        if (sort === "featured") next.delete("sort");
        else next.set("sort", sort);
      });
    },
    [update],
  );

  const clear = useCallback(() => {
    update((next) => {
      ["category", "color", "size", "min", "max"].forEach((k) => {
        next.delete(k);
      });
    });
  }, [update]);

  const activeCount =
    filters.categories.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0);

  return { filters, toggle, setPrice, setSort, clear, activeCount };
}
