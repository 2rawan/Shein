import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => {
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids] }));
      },
      remove: (id) => {
        set((s) => ({ ids: s.ids.filter((x) => x !== id) }));
      },
    }),
    {
      name: "nova:wishlist",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
