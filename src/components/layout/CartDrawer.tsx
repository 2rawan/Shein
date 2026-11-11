import { AnimatePresence, motion } from "framer-motion";
import { CartLineItem, CartLineSkeleton, FreeShippingMeter } from "@/components/cart/CartLineItem";
import { ButtonLink } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { useCartDetails } from "@/hooks/useCartDetails";
import { useI18n } from "@/i18n";
import { useMoney } from "@/hooks/useMoney";
import { useUi } from "@/store/ui";

export function CartDrawer() {
  const { t } = useI18n();
  const money = useMoney();
  const open = useUi((s) => s.cartOpen);
  const close = useUi((s) => s.closeCart);
  const cart = useCartDetails();
  const empty = !cart.loading && cart.lines.length === 0;

  return (
    <Drawer
      open={open}
      onClose={close}
      title={`${t.cart.title} (${cart.count})`}
      footer={
        empty ? undefined : (
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <span className="text-ink-soft">{t.cart.subtotal}</span>
              <span className="font-display text-2xl tabular-nums">{money(cart.subtotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink to="/cart" variant="outline" onClick={close}>
                {t.cart.viewBag}
              </ButtonLink>
              <ButtonLink to="/checkout" onClick={close}>
                {t.cart.checkout}
              </ButtonLink>
            </div>
          </div>
        )
      }
    >
      <div className="px-6">
        {empty ? (
          <div className="flex flex-col items-start gap-5 py-12">
            <p className="font-display text-3xl italic">{t.cart.emptyTitle}</p>
            <p className="text-ink-soft">{t.cart.emptyBody}</p>
            <ButtonLink to="/shop" onClick={close}>
              {t.common.continueShopping}
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="py-5">
              <FreeShippingMeter
                subtotal={cart.subtotal}
                remaining={cart.remainingForFreeShipping}
              />
            </div>
            {cart.loading ? (
              <CartLineSkeleton />
            ) : (
              <ul className="divide-y divide-line border-t border-line">
                <AnimatePresence initial={false}>
                  {cart.lines.map((line) => (
                    <motion.li
                      key={line.key}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <CartLineItem line={line} onNavigate={close} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
}
