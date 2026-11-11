import type { Locale } from "./types";

/** Latin digits in both languages keep prices and codes consistent. */
export const INTL_LOCALE: Record<Locale, string> = { en: "en-US", ar: "ar-AE" };

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function pluralCategory(count: number, locale: Locale): Intl.LDMLPluralRule {
  return new Intl.PluralRules(INTL_LOCALE[locale]).select(count);
}
