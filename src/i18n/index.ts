import { useEffect } from "react";
import type { Locale, Localized } from "@/lib/types";
import { usePreferences } from "@/store/preferences";
import { ar } from "./ar";
import { en, type Messages } from "./en";

const dictionaries: Record<Locale, Messages> = { en, ar };

export function useI18n() {
  const locale = usePreferences((s) => s.locale);
  const setLocale = usePreferences((s) => s.setLocale);
  return {
    locale,
    setLocale,
    t: dictionaries[locale],
    dir: locale === "ar" ? ("rtl" as const) : ("ltr" as const),
    /** Picks the active-language value of a bilingual catalogue field. */
    l: (value: Localized) => value[locale],
  };
}

/** Keeps <html lang dir> in sync with the selected language. */
export function useDocumentLocale() {
  const locale = usePreferences((s) => s.locale);
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
}
