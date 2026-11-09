import { useId } from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { COLOR_BY_ID } from "@/lib/constants";
import type { ColorId } from "@/lib/types";

interface ColorSwatchesProps {
  colors: ColorId[];
  value: ColorId;
  onChange: (color: ColorId) => void;
}

/** Native radio group styled as swatches; arrow keys move between options. */
export function ColorSwatches({ colors, value, onChange }: ColorSwatchesProps) {
  const { t, l } = useI18n();
  const name = useId();
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm">
        <span className="text-stone">{t.common.color}: </span>
        {l(COLOR_BY_ID[value].name)}
      </legend>
      <div className="flex flex-wrap gap-2">
        {colors.map((id) => {
          const color = COLOR_BY_ID[id];
          return (
            <label key={id} className="relative cursor-pointer" title={l(color.name)}>
              <input
                type="radio"
                name={name}
                value={id}
                checked={value === id}
                onChange={() => {
                  onChange(id);
                }}
                className="peer sr-only"
              />
              <span className="sr-only">{l(color.name)}</span>
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-full border border-transparent transition-colors peer-checked:border-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
              >
                <span
                  className="size-7 rounded-full ring-1 ring-ink/15"
                  style={{ backgroundColor: color.hex }}
                />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

interface SizeSelectorProps {
  sizes: string[];
  soldOut?: string[] | undefined;
  value: string | null;
  onChange: (size: string) => void;
  error?: string | undefined;
}

export function SizeSelector({ sizes, soldOut = [], value, onChange, error }: SizeSelectorProps) {
  const { t } = useI18n();
  const name = useId();
  const errorId = `${name}-error`;
  return (
    <fieldset
      className="flex flex-col"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-3 text-sm">
        <span className="text-stone">{t.common.size}</span>
        {value && <span>: {value}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const unavailable = soldOut.includes(size);
          return (
            <label
              key={size}
              className={cn("relative", unavailable ? "cursor-not-allowed" : "cursor-pointer")}
            >
              <input
                type="radio"
                name={name}
                value={size}
                checked={value === size}
                disabled={unavailable}
                onChange={() => {
                  onChange(size);
                }}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-11 min-w-14 items-center justify-center border px-3 text-sm transition-colors duration-200",
                  "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper",
                  "peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                  unavailable
                    ? "border-line text-sand line-through"
                    : "border-line hover:border-ink",
                  error && !unavailable && "border-danger/60",
                )}
              >
                {size}
                {unavailable && <span className="sr-only"> — {t.product.soldOut}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-3 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
