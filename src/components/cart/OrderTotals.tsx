import type { ReactNode } from "react";
import { useI18n } from "@/i18n";
import { formatPrice } from "@/lib/format";

interface OrderTotalsProps {
  subtotal: number;
  /** null renders "calculated at checkout". */
  shipping: number | null;
  children?: ReactNode;
}

export function OrderTotals({ subtotal, shipping, children }: OrderTotalsProps) {
  const { t, locale } = useI18n();
  const total = subtotal + (shipping ?? 0);
  return (
    <div className="flex flex-col gap-3">
      <dl className="flex flex-col gap-3 text-[0.9375rem]">
        <div className="flex justify-between">
          <dt className="text-ink-soft">{t.cart.subtotal}</dt>
          <dd className="tabular-nums">{formatPrice(subtotal, locale)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">{t.cart.shipping}</dt>
          <dd className="tabular-nums">
            {shipping === null
              ? t.cart.shippingAtCheckout
              : shipping === 0
                ? t.cart.shippingFree
                : formatPrice(shipping, locale)}
          </dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
          <dt>{t.cart.total}</dt>
          <dd className="font-display text-2xl tabular-nums">{formatPrice(total, locale)}</dd>
        </div>
      </dl>
      <p className="text-xs text-stone">{t.cart.taxesNote}</p>
      {children}
    </div>
  );
}
