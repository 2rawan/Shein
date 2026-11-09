import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine, ColorId } from "@/lib/types";

interface AddInput {
  productId: string;
  color: ColorId;
  size: string;
  quantity?: number;
}

interface CartState {
  lines: CartLine[];
  add: (input: AddInput) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const MAX_QUANTITY = 10;

export const lineKey = (productId: string, color: string, size: string) =>
  `${productId}::${color}::${size}`;

const clampQty = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(n)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: ({ productId, color, size, quantity = 1 }) => {
        set((state) => {
          const key = lineKey(productId, color, size);
          const existing = state.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.key === key ? { ...l, quantity: clampQty(l.quantity + quantity) } : l,
              ),
            };
          }
          return {
            lines: [...state.lines, { key, productId, color, size, quantity: clampQty(quantity) }],
          };
        });
      },
      setQuantity: (key, quantity) => {
        set((state) => ({
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, quantity: clampQty(quantity) } : l,
          ),
        }));
      },
      remove: (key) => {
        set((state) => ({ lines: state.lines.filter((l) => l.key !== key) }));
      },
      clear: () => {
        set({ lines: [] });
      },
    }),
    {
      name: "nova:cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const selectCartCount = (s: CartState) => s.lines.reduce((sum, l) => sum + l.quantity, 0);
