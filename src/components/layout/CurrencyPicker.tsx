import { useDeferredValue, useMemo, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { currencyName, POPULAR_CURRENCIES, supportedCurrencies } from "@/lib/currency";
import { formatDate, INTL_LOCALE } from "@/lib/format";
import { usePreferences } from "@/store/preferences";
import { useRates } from "@/store/rates";
import { useUi } from "@/store/ui";

interface Option {
  code: string;
  name: string;
  symbol: string;
}

function symbolFor(code: string, intlLocale: string): string {
  const part = new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: code,
    currencyDisplay: "narrowSymbol",
  })
    .formatToParts(0)
    .find((p) => p.type === "currency");
  return part?.value ?? code;
}

export function CurrencyButton({ className }: { className?: string }) {
  const { t } = useI18n();
  const currency = usePreferences((s) => s.currency);
  const open = useUi((s) => s.setCurrencyOpen);
  return (
    <button
      type="button"
      onClick={() => {
        open(true);
      }}
      aria-label={t.nav.currency(currency)}
      className={cn(
        "inline-flex h-11 items-center gap-1.5 px-2 text-sm tabular-nums transition-colors hover:text-clay",
        className,
      )}
    >
      <Icon name="globe" size={16} />
      {currency}
    </button>
  );
}

export function CurrencyPicker() {
  const { t, locale } = useI18n();
  const open = useUi((s) => s.currencyOpen);
  const setOpen = useUi((s) => s.setCurrencyOpen);
  const announce = useUi((s) => s.announce);
  const current = usePreferences((s) => s.currency);
  const setCurrency = usePreferences((s) => s.setCurrency);
  const rates = useRates((s) => s.rates);
  const updatedAt = useRates((s) => s.updatedAt);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const intlLocale = INTL_LOCALE[locale];

  const options = useMemo<Option[]>(
    () =>
      supportedCurrencies(rates).map((code) => ({
        code,
        name: currencyName(code, intlLocale),
        symbol: symbolFor(code, intlLocale),
      })),
    [rates, intlLocale],
  );

  const q = deferred.trim().toLowerCase();
  const matches = q
    ? options.filter((o) => o.code.toLowerCase().includes(q) || o.name.toLowerCase().includes(q))
    : options;
  const popular = q
    ? []
    : POPULAR_CURRENCIES.flatMap((code) => options.filter((o) => o.code === code));

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const choose = (option: Option) => {
    setCurrency(option.code);
    announce(`${t.currency.title}: ${option.name}`);
    close();
  };

  const renderList = (list: Option[], label: string) => (
    <section aria-label={label} className="mb-8">
      <h3 className="label mb-2 text-stone">{label}</h3>
      <ul className="flex flex-col">
        {list.map((o) => {
          const selected = o.code === current;
          return (
            <li key={o.code}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  choose(o);
                }}
                className={cn(
                  "flex w-full items-center gap-4 border-b border-line py-3 text-start transition-colors hover:text-clay",
                  selected && "font-medium",
                )}
              >
                <span className="w-12 text-sm tabular-nums" dir="ltr">
                  {o.code}
                </span>
                <span className="flex-1 text-[0.9375rem]">{o.name}</span>
                <span className="text-sm text-stone">{o.symbol}</span>
                <Icon name="check" size={16} className={selected ? "text-ink" : "invisible"} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
    <Drawer open={open} onClose={close} title={t.currency.title}>
      <div className="flex flex-col px-6 pt-6">
        <label htmlFor="currency-search" className="sr-only">
          {t.currency.searchLabel}
        </label>
        <div className="flex items-center gap-3 border-b border-ink pb-2">
          <Icon name="search" size={18} className="text-stone" />
          <input
            id="currency-search"
            type="search"
            data-autofocus
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder={t.currency.searchPlaceholder}
            className="h-10 flex-1 bg-transparent text-[0.9375rem] placeholder:text-stone/70 focus:outline-none"
          />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-stone">
          {t.currency.note} {t.currency.updated(formatDate(updatedAt, locale))}
        </p>
      </div>
      <div className="px-6 pt-6 pb-4">
        {popular.length > 0 && renderList(popular, t.currency.popular)}
        {matches.length > 0 ? (
          renderList(matches, `${t.currency.all} · ${t.currency.count(matches.length)}`)
        ) : (
          <p className="py-8 text-sm text-ink-soft" role="status">
            {t.currency.noResults}
          </p>
        )}
      </div>
    </Drawer>
  );
}
