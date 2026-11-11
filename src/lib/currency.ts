import bundled from "@/data/rates.json";

/** Catalogue prices are authored in USD and converted for display. */
export const BASE_CURRENCY = "USD";

export type Rates = Record<string, number>;

export interface RateTable {
  rates: Rates;
  /** ISO timestamp of the provider's last update. */
  updatedAt: string;
}

export const BUNDLED_RATES: RateTable = {
  rates: bundled.rates,
  updatedAt: new Date(bundled.updatedAt).toISOString(),
};

/** Free, key-less provider covering ~160 currencies, updated daily. */
const RATES_ENDPOINT = "https://open.er-api.com/v6/latest/USD";

interface ProviderResponse {
  result: string;
  time_last_update_utc: string;
  rates: Rates;
}

export async function fetchLiveRates(signal?: AbortSignal): Promise<RateTable> {
  const res = await fetch(RATES_ENDPOINT, { signal });
  if (!res.ok) throw new Error(`Rates request failed: ${res.status}`);
  const data = (await res.json()) as ProviderResponse;
  if (data.result !== "success") throw new Error("Rates provider returned an error");
  return { rates: data.rates, updatedAt: new Date(data.time_last_update_utc).toISOString() };
}

const intlCurrencies = new Set(Intl.supportedValuesOf("currency"));

/** Currencies that both the browser can format and the provider can price. */
export function supportedCurrencies(rates: Rates): string[] {
  return Object.keys(rates)
    .filter((code) => intlCurrencies.has(code))
    .sort();
}

/** Shown first in the picker: global majors plus the region the store serves most. */
export const POPULAR_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SAR",
  "JOD",
  "ILS",
  "EGP",
  "KWD",
  "QAR",
] as const;

export function convert(amountUsd: number, currency: string, rates: Rates): number {
  return amountUsd * (rates[currency] ?? 1);
}

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(amount: number, currency: string, intlLocale: string): string {
  const key = `${intlLocale}|${currency}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      trailingZeroDisplay: "stripIfInteger",
    });
    formatters.set(key, formatter);
  }
  return formatter.format(amount);
}

const displayNames = new Map<string, Intl.DisplayNames>();

export function currencyName(code: string, intlLocale: string): string {
  let names = displayNames.get(intlLocale);
  if (!names) {
    names = new Intl.DisplayNames([intlLocale], { type: "currency" });
    displayNames.set(intlLocale, names);
  }
  return names.of(code) ?? code;
}
