import type { ReactNode } from "react";
import { useI18n } from "@/i18n";
import type { CatalogFilters } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { CATEGORIES, COLOR_BY_ID } from "@/lib/constants";
import type { ColorId } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { PriceRange } from "./PriceRange";

interface FilterPanelProps {
  filters: CatalogFilters;
  bounds: [number, number];
  sizes: string[];
  colors: ColorId[];
  counts: Record<string, number>;
  onToggle: (key: "category" | "color" | "size", value: string) => void;
  onPrice: (min: number | null, max: number | null) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <legend className="label float-left mb-5 w-full text-ink">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export function FilterPanel({
  filters,
  bounds,
  sizes,
  colors,
  counts,
  onToggle,
  onPrice,
}: FilterPanelProps) {
  const { t, l } = useI18n();

  return (
    <div>
      <Section title={t.shop.category}>
        <ul className="flex flex-col gap-1">
          {CATEGORIES.map((c) => {
            const checked = filters.categories.includes(c.id);
            return (
              <li key={c.id}>
                <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-[0.9375rem]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      onToggle("category", c.id);
                    }}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-4 items-center justify-center border border-stone transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
                  >
                    {checked && <Icon name="check" size={12} strokeWidth={2} />}
                  </span>
                  <span className="flex-1 transition-colors group-hover:text-clay">
                    {l(c.name)}
                  </span>
                  <span className="text-xs text-stone tabular-nums">{counts[c.id] ?? 0}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title={t.shop.price}>
        <PriceRange
          bounds={bounds}
          min={filters.minPrice}
          max={filters.maxPrice}
          onCommit={onPrice}
        />
      </Section>

      <Section title={t.shop.size}>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const checked = filters.sizes.includes(size);
            return (
              <label key={size} className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onToggle("size", size);
                  }}
                  className="peer sr-only"
                />
                <span className="flex h-9 min-w-11 items-center justify-center border border-line px-2.5 text-[0.8125rem] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink hover:border-ink">
                  {size}
                </span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section title={t.shop.color}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          {colors.map((id) => {
            const color = COLOR_BY_ID[id];
            const checked = filters.colors.includes(id);
            return (
              <label key={id} className="group flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onToggle("color", id);
                  }}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-5 rounded-full ring-1 ring-ink/15 ring-offset-2 ring-offset-paper transition-shadow peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink",
                    checked && "ring-2 ring-ink",
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <span
                  className={cn(
                    "transition-colors group-hover:text-clay",
                    checked && "font-medium",
                  )}
                >
                  {l(color.name)}
                </span>
              </label>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
