import { create } from "zustand";

/** Transient, non-persisted UI state shared across the layout. */
interface UiState {
  cartOpen: boolean;
  menuOpen: boolean;
  /** Polite screen-reader announcement, e.g. "Added to bag". */
  announcement: string;
  openCart: () => void;
  closeCart: () => void;
  setMenuOpen: (open: boolean) => void;
  announce: (message: string) => void;
}

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  menuOpen: false,
  announcement: "",
  openCart: () => {
    set({ cartOpen: true, menuOpen: false });
  },
  closeCart: () => {
    set({ cartOpen: false });
  },
  setMenuOpen: (menuOpen) => {
    set({ menuOpen });
  },
  announce: (message) => {
    // Clearing first guarantees repeated identical messages are re-announced.
    set({ announcement: "" });
    requestAnimationFrame(() => {
      set({ announcement: message });
    });
  },
}));
