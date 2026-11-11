import { useCallback } from "react";
import { useI18n } from "@/i18n";
import { convert, formatMoney } from "@/lib/currency";
import { INTL_LOCALE } from "@/lib/format";
import { usePreferences } from "@/store/preferences";
import { useRates } from "@/store/rates";

/**
 * Returns a formatter that converts a USD catalogue amount into the shopper's
 * chosen currency and formats it for the active language.
 */
export function useMoney() {
  const { locale } = useI18n();
  const currency = usePreferences((s) => s.currency);
  const rates = useRates((s) => s.rates);
  // Fall back to USD if a saved currency disappears from the provider.
  const active = currency in rates ? currency : "USD";

  return useCallback(
    (amountUsd: number) =>
      formatMoney(convert(amountUsd, active, rates), active, INTL_LOCALE[locale]),
    [active, rates, locale],
  );
}

/** The shopper's active currency and its USD exchange rate. */
export function useCurrency() {
  const currency = usePreferences((s) => s.currency);
  const rates = useRates((s) => s.rates);
  const active = currency in rates ? currency : "USD";
  return { currency: active, rate: rates[active] ?? 1 };
}
