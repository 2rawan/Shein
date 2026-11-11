import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { useMoney } from "@/hooks/useMoney";

interface PriceProps {
  amount: number;
  compareAt?: number | undefined;
  className?: string;
}

export function Price({ amount, compareAt, className }: PriceProps) {
  const { t } = useI18n();
  const money = useMoney();
  const onSale = compareAt !== undefined && compareAt > amount;
  return (
    <span className={cn("inline-flex items-baseline gap-2 tabular-nums", className)}>
      <span className={onSale ? "text-clay" : undefined}>{money(amount)}</span>
      {onSale && (
        <s className="text-stone">
          <span className="sr-only">{t.product.originalPrice} </span>
          {money(compareAt)}
        </s>
      )}
    </span>
  );
}
