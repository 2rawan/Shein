import { AnimatePresence, motion } from "framer-motion";
import { CartLineItem, CartLineSkeleton, FreeShippingMeter } from "@/components/cart/CartLineItem";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, SectionHeading } from "@/components/ui/Typography";
import { useCartDetails } from "@/hooks/useCartDetails";
import { useDocumentTitle } from "@/hooks/useDom";
import { useI18n } from "@/i18n";

export default function CartPage() {
  const { t } = useI18n();
  const cart = useCartDetails();
  useDocumentTitle(t.meta.cart);

  if (!cart.loading && cart.lines.length === 0) {
    return (
      <div className="container-nova pt-10 md:pt-16">
        <SectionHeading as="h1" size="lg" title={t.cart.title} />
        <EmptyState
          title={t.cart.emptyTitle}
          body={t.cart.emptyBody}
          action={<ButtonLink to="/shop">{t.common.continueShopping}</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="container-nova pt-10 md:pt-16">
      <div className="mb-10 flex items-end justify-between gap-6">
        <SectionHeading as="h1" size="lg" title={t.cart.title} />
        <p className="text-sm text-stone">{t.common.items(cart.count)}</p>
      </div>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <section className="lg:col-span-7" aria-label={t.cart.title}>
          {cart.loading ? (
            <CartLineSkeleton />
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              <AnimatePresence initial={false}>
                {cart.lines.map((line) => (
                  <motion.li
                    key={line.key}
                    layout
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <CartLineItem line={line} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>
        <aside className="lg:col-span-4 lg:col-start-9" aria-label={t.cart.orderSummary}>
          <div className="flex flex-col gap-8 bg-bone/70 p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="label">{t.cart.orderSummary}</h2>
            <FreeShippingMeter subtotal={cart.subtotal} remaining={cart.remainingForFreeShipping} />
            <OrderTotals subtotal={cart.subtotal} shipping={cart.freeShipping ? 0 : null}>
              <ButtonLink to="/checkout" size="lg" block className="mt-4">
                {t.cart.checkout}
              </ButtonLink>
              <ButtonLink to="/shop" variant="ghost" block>
                {t.common.continueShopping}
              </ButtonLink>
            </OrderTotals>
          </div>
        </aside>
      </div>
    </div>
  );
}
