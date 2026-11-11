import { useI18n } from "@/i18n";
import { MAX_QUANTITY } from "@/store/cart";
import { Icon } from "./Icon";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export function QuantityStepper({ value, onChange, label }: QuantityStepperProps) {
  const { t } = useI18n();
  const btn =
    "inline-flex size-9 items-center justify-center text-ink transition-colors hover:text-clay disabled:text-sand disabled:hover:text-sand";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center border border-line">
      <button
        type="button"
        className={btn}
        aria-label={t.common.decrease}
        disabled={value <= 1}
        onClick={() => {
          onChange(value - 1);
        }}
      >
        <Icon name="minus" size={14} />
      </button>
      <output aria-live="polite" className="w-7 text-center text-sm tabular-nums">
        {value}
      </output>
      <button
        type="button"
        className={btn}
        aria-label={t.common.increase}
        disabled={value >= MAX_QUANTITY}
        onClick={() => {
          onChange(value + 1);
        }}
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
