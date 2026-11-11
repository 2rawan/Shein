import { useEffect, useState } from "react";
import { getCachedProducts, loadProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

type State =
  | { status: "loading"; products: null; error: null }
  | { status: "ready"; products: Product[]; error: null }
  | { status: "error"; products: null; error: Error };

const initial = (): State => {
  const cached = getCachedProducts();
  return cached
    ? { status: "ready", products: cached, error: null }
    : { status: "loading", products: null, error: null };
};

export function useProducts(): State {
  const [state, setState] = useState<State>(initial);

  useEffect(() => {
    if (state.status !== "loading") return;
    let active = true;
    loadProducts().then(
      (products) => {
        if (active) setState({ status: "ready", products, error: null });
      },
      (error: unknown) => {
        if (active) {
          setState({
            status: "error",
            products: null,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [state.status]);

  return state;
}
