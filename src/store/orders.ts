import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ColorId, Localized } from "@/lib/types";

export interface OrderLine {
  productId: string;
  name: Localized;
  image: string;
  color: ColorId;
  size: string;
  quantity: number;
  /** USD, as listed in the catalogue. */
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  lines: OrderLine[];
  /** USD amounts; `currency` and `rate` record what the shopper was charged in. */
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  rate: number;
  shipCity: string;
  /** ISO country code, translated when displayed. */
  shipCountry: string;
}

interface OrdersState {
  orders: Order[];
  add: (order: Order) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      add: (order) => {
        set((s) => ({ orders: [order, ...s.orders] }));
      },
    }),
    {
      name: "nova:orders",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
