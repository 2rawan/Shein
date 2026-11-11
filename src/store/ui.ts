import { create } from "zustand";

/** Transient, non-persisted UI state shared across the layout. */
interface UiState {
  cartOpen: boolean;
  menuOpen: boolean;
  currencyOpen: boolean;
  /** Polite screen-reader announcement, e.g. "Added to bag". */
  announcement: string;
  openCart: () => void;
  closeCart: () => void;
  setMenuOpen: (open: boolean) => void;
  setCurrencyOpen: (open: boolean) => void;
  announce: (message: string) => void;
}

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  menuOpen: false,
  currencyOpen: false,
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
  setCurrencyOpen: (currencyOpen) => {
    // Only one drawer at a time.
    set(currencyOpen ? { currencyOpen, menuOpen: false, cartOpen: false } : { currencyOpen });
  },
  announce: (message) => {
    // Clearing first guarantees repeated identical messages are re-announced.
    set({ announcement: "" });
    requestAnimationFrame(() => {
      set({ announcement: message });
    });
  },
}));
