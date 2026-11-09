import { Link } from "react-router";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { SmartImage } from "@/components/ui/SmartImage";
import type { ResolvedLine } from "@/hooks/useCartDetails";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { COLOR_BY_ID } from "@/lib/constants";
import { useCart } from "@/store/cart";

interface CartLineItemProps {
  line: ResolvedLine;
  /** Compact lines (checkout summary) are read-only. */
  compact?: boolean;
  onNavigate?: () => void;
}

export function CartLineItem({ line, compact = false, onNavigate }: CartLineItemProps) {
  const { t, l } = useI18n();
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const name = l(line.product.name);
  const href = `/product/${line.product.id}`;

  return (
    <div className={cn("flex gap-4", compact ? "py-3" : "py-6")}>
      <Link
        to={href}
        onClick={onNavigate}
        className={cn("shrink-0", compact ? "w-16" : "w-24 md:w-28")}
        tabIndex={-1}
        aria-hidden="true"
      >
        <SmartImage src={line.product.images[0] ?? ""} alt="" sizes="112px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={href}
              onClick={onNavigate}
              className="text-[0.9375rem] leading-snug hover:text-clay"
            >
              {name}
            </Link>
            <p className="mt-1 text-[0.8125rem] text-stone">
              {t.cart.lineSummary(l(COLOR_BY_ID[line.color].name), line.size)}
              {compact && ` · ×${line.quantity}`}
            </p>
          </div>
          <Price amount={line.lineTotal} className="text-sm" />
        </div>
        {!compact && (
          <div className="mt-auto flex items-center justify-between pt-4">
            <QuantityStepper
              value={line.quantity}
              label={`${t.common.quantity}: ${name}`}
              onChange={(q) => {
                setQuantity(line.key, q);
              }}
            />
            <button
              type="button"
              onClick={() => {
                remove(line.key);
              }}
              aria-label={t.cart.removeLine(name)}
              className="link-underline text-[0.8125rem] text-ink-soft"
            >
              {t.common.remove}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CartLineSkeleton() {
  return (
    <div className="flex gap-4 py-6" aria-hidden="true">
      <div className="skeleton aspect-[4/5] w-24" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  );
}

export function FreeShippingMeter({
  subtotal,
  remaining,
}: {
  subtotal: number;
  remaining: number;
}) {
  const { t, locale } = useI18n();
  const pct = Math.min(100, (subtotal / (subtotal + remaining || 1)) * 100);
  const unlocked = remaining <= 0;
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[0.8125rem] text-ink-soft">
        {unlocked
          ? t.cart.freeShippingUnlocked
          : t.cart.freeShippingRemaining(formatPrice(remaining, locale))}
      </p>
      <div className="h-px w-full bg-line">
        <div
          className="h-px bg-ink transition-[width] duration-700 ease-editorial"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
