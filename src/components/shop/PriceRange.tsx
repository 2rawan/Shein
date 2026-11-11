import { useState } from "react";
import { useI18n } from "@/i18n";
import { formatPrice } from "@/lib/format";

interface PriceRangeProps {
  bounds: [number, number];
  min: number | null;
  max: number | null;
  onCommit: (min: number | null, max: number | null) => void;
}

/**
 * Dual-thumb price slider. Dragging updates local state; the URL is only
 * written on release so history and filtering don't thrash.
 */
export function PriceRange({ bounds, min, max, onCommit }: PriceRangeProps) {
  const { t, locale } = useI18n();
  const [lo, hi] = bounds;
  const [value, setValue] = useState<[number, number]>([min ?? lo, max ?? hi]);

  // Re-sync when filters change elsewhere (e.g. "Clear all").
  const [synced, setSynced] = useState({ min, max, lo, hi });
  if (synced.min !== min || synced.max !== max || synced.lo !== lo || synced.hi !== hi) {
    setSynced({ min, max, lo, hi });
    setValue([min ?? lo, max ?? hi]);
  }

  const commit = () => {
    const [a, b] = value;
    onCommit(a <= lo ? null : a, b >= hi ? null : b);
  };

  const span = hi - lo || 1;
  const startPct = ((value[0] - lo) / span) * 100;
  const endPct = ((value[1] - lo) / span) * 100;
  const step = 10;

  return (
    <div className="flex flex-col gap-5 pt-1">
      <div className="relative h-4">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-ink"
          style={{ insetInlineStart: `${startPct}%`, insetInlineEnd: `${100 - endPct}%` }}
        />
        <input
          type="range"
          aria-label={t.shop.minPrice}
          aria-valuetext={formatPrice(value[0], locale)}
          min={lo}
          max={hi}
          step={step}
          value={value[0]}
          onChange={(e) => {
            setValue(([, b]) => [Math.min(Number(e.target.value), b - step), b]);
          }}
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
          className="range-thumb absolute inset-0 h-4 w-full"
        />
        <input
          type="range"
          aria-label={t.shop.maxPrice}
          aria-valuetext={formatPrice(value[1], locale)}
          min={lo}
          max={hi}
          step={step}
          value={value[1]}
          onChange={(e) => {
            setValue(([a]) => [a, Math.max(Number(e.target.value), a + step)]);
          }}
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
          className="range-thumb absolute inset-0 h-4 w-full"
        />
      </div>
      <div className="flex justify-between text-sm text-ink-soft tabular-nums">
        <span>{formatPrice(value[0], locale)}</span>
        <span>{formatPrice(value[1], locale)}</span>
      </div>
    </div>
  );
}
