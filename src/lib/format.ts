import type { Locale } from "./types";

const intlLocale: Record<Locale, string> = { en: "en-US", ar: "ar-AE" };

const currencyFormatters = new Map<Locale, Intl.NumberFormat>();

export function formatPrice(amount: number, locale: Locale): string {
  let formatter = currencyFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale[locale], {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    currencyFormatters.set(locale, formatter);
  }
  return formatter.format(amount);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(value);
}

export function pluralCategory(count: number, locale: Locale): Intl.LDMLPluralRule {
  return new Intl.PluralRules(intlLocale[locale]).select(count);
}
