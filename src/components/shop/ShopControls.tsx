import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { SORT_KEYS, type CatalogFilters } from "@/lib/catalog";
import { CATEGORY_BY_ID, COLOR_BY_ID } from "@/lib/constants";
import { useMoney } from "@/hooks/useMoney";
import type { SortKey } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

export function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: string) => void }) {
  const { t } = useI18n();
  return (
    <label className="relative inline-flex items-center gap-2 text-sm">
      <span className="text-stone">{t.shop.sort}</span>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="cursor-pointer appearance-none bg-transparent py-2 pe-6 font-medium focus:outline-none focus-visible:outline-1 focus-visible:outline-ink"
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {t.shop.sortOptions[key]}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={14} className="pointer-events-none absolute end-0" />
    </label>
  );
}

interface ActiveFiltersProps {
  filters: CatalogFilters;
  onToggle: (key: "category" | "color" | "size", value: string) => void;
  onClearPrice: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onToggle, onClearPrice, onClearAll }: ActiveFiltersProps) {
  const { t, l } = useI18n();
  const money = useMoney();

  const chips: { id: string; label: string; remove: () => void }[] = [
    ...filters.categories.map((c) => ({
      id: `c-${c}`,
      label: l(CATEGORY_BY_ID[c].name),
      remove: () => {
        onToggle("category", c);
      },
    })),
    ...filters.sizes.map((s) => ({
      id: `s-${s}`,
      label: s,
      remove: () => {
        onToggle("size", s);
      },
    })),
    ...filters.colors.map((c) => ({
      id: `k-${c}`,
      label: l(COLOR_BY_ID[c].name),
      remove: () => {
        onToggle("color", c);
      },
    })),
  ];
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const from = filters.minPrice !== null ? money(filters.minPrice) : "";
    const to = filters.maxPrice !== null ? money(filters.maxPrice) : "";
    chips.push({
      id: "price",
      label: from && to ? `${from} – ${to}` : from ? `≥ ${from}` : `≤ ${to}`,
      remove: onClearPrice,
    });
  }

  if (!chips.length) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label={t.shop.activeFilters}
      role="group"
    >
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.button
            key={chip.id}
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={chip.remove}
            aria-label={t.shop.removeFilter(chip.label)}
            className="inline-flex h-8 items-center gap-2 border border-line bg-white px-3 text-[0.8125rem] transition-colors hover:border-ink"
          >
            {chip.label}
            <Icon name="close" size={12} />
          </motion.button>
        ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={onClearAll}
        className="link-underline ms-2 text-[0.8125rem] text-ink-soft"
      >
        {t.shop.clearAll}
      </button>
    </div>
  );
}
