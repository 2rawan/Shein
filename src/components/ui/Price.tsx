import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

interface PriceProps {
  amount: number;
  compareAt?: number | undefined;
  className?: string;
}

export function Price({ amount, compareAt, className }: PriceProps) {
  const { locale, t } = useI18n();
  const onSale = compareAt !== undefined && compareAt > amount;
  return (
    <span className={cn("inline-flex items-baseline gap-2 tabular-nums", className)}>
      <span className={onSale ? "text-clay" : undefined}>{formatPrice(amount, locale)}</span>
      {onSale && (
        <s className="text-stone">
          <span className="sr-only">{t.product.originalPrice} </span>
          {formatPrice(compareAt, locale)}
        </s>
      )}
    </span>
  );
}
