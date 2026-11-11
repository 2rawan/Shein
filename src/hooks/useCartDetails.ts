import { useMemo } from "react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import type { CartLine, Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { useProducts } from "./useProducts";

export interface ResolvedLine extends CartLine {
  product: Product;
  lineTotal: number;
}

/** Joins persisted cart lines with catalogue data and derives totals. */
export function useCartDetails() {
  const lines = useCart((s) => s.lines);
  const { products, status } = useProducts();

  return useMemo(() => {
    const byId = new Map(products?.map((p) => [p.id, p]));
    const resolved: ResolvedLine[] = [];
    for (const line of lines) {
      const product = byId.get(line.productId);
      if (product) resolved.push({ ...line, product, lineTotal: product.price * line.quantity });
    }
    const subtotal = resolved.reduce((sum, l) => sum + l.lineTotal, 0);
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    return {
      loading: status === "loading",
      lines: resolved,
      count,
      subtotal,
      freeShipping: subtotal >= FREE_SHIPPING_THRESHOLD,
      remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    };
  }, [lines, products, status]);
}
