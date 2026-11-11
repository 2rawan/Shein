import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BASE_CURRENCY } from "@/lib/currency";
import type { Locale } from "@/lib/types";

interface PreferencesState {
  locale: Locale;
  currency: string;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: string) => void;
}

/** Storage key is also read by the inline script in index.html. */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: "en",
      currency: BASE_CURRENCY,
      setLocale: (locale) => {
        set({ locale });
      },
      setCurrency: (currency) => {
        set({ currency });
      },
    }),
    {
      name: "nova:preferences",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // v1 had no currency; fill the default rather than dropping the saved language.
      migrate: (persisted) => ({
        currency: BASE_CURRENCY,
        ...(persisted as Partial<PreferencesState>),
      }),
    },
  ),
);
