import { motion } from "framer-motion";
import { useState, type ReactNode, type SyntheticEvent } from "react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { FormAlert } from "@/components/ui/FormControls";
import { Icon } from "@/components/ui/Icon";
import { EmptyState, SectionHeading } from "@/components/ui/Typography";
import { useCartDetails } from "@/hooks/useCartDetails";
import { useDocumentTitle } from "@/hooks/useDom";
import { useForm, type Rule } from "@/hooks/useForm";
import { useCurrency, useMoney } from "@/hooks/useMoney";
import { useI18n } from "@/i18n";
import { imagesForColor } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { SHIPPING_RATES, type ShippingMethod } from "@/lib/constants";
import { currencyName } from "@/lib/currency";
import { INTL_LOCALE } from "@/lib/format";
import {
  cardNumber,
  compose,
  cvc,
  email,
  expiry,
  formatCardNumber,
  formatExpiry,
  minLength,
  phone,
  postalCode,
  required,
} from "@/lib/validation";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { useCurrentUser } from "@/store/session";

type FieldName =
  | "email"
  | "phone"
  | "firstName"
  | "lastName"
  | "address"
  | "apartment"
  | "city"
  | "country"
  | "postalCode"
  | "cardName"
  | "cardNumber"
  | "expiry"
  | "cvc";

// Declaration order is the focus order for the first invalid field.
const rules: Record<FieldName, Rule<FieldName>> = {
  email: compose(required, email),
  phone: compose(required, phone),
  firstName: required,
  lastName: required,
  address: compose(required, minLength(5)),
  apartment: () => null,
  city: required,
  country: required,
  postalCode: compose(required, postalCode),
  cardName: required,
  cardNumber: compose(required, cardNumber),
  expiry: compose(required, expiry()),
  cvc: compose(required, cvc),
};

const format = { cardNumber: formatCardNumber, expiry: formatExpiry };

interface Confirmation {
  order: string;
  email: string;
}

function Fieldset({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-5 border-t border-line pt-8">
      <legend className="float-left mb-2 flex w-full items-baseline gap-3">
        <span className="font-display text-xl text-clay italic tabular-nums">0{step}</span>
        <span className="font-display text-2xl">{title}</span>
      </legend>
      <div className="clear-both grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Rendered behind RequireAuth, so a signed-in user is always present. */
export default function CheckoutPage() {
  const { t, locale } = useI18n();
  const money = useMoney();
  const { currency, rate } = useCurrency();
  const user = useCurrentUser();
  const cart = useCartDetails();
  const clearCart = useCart((s) => s.clear);
  const addOrder = useOrders((s) => s.add);
  useDocumentTitle(t.meta.checkout);

  const form = useForm({
    rules,
    format,
    initial: {
      email: user?.email ?? "",
      phone: "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      address: "",
      apartment: "",
      city: "",
      country: "AE",
      postalCode: "",
      cardName: user ? `${user.firstName} ${user.lastName}` : "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  });
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const costOf = (method: ShippingMethod) =>
    method === "standard" && cart.freeShipping ? 0 : SHIPPING_RATES[method];
  const shippingCost = costOf(shipping);
  const total = cart.subtotal + shippingCost;

  const field = (name: FieldName) => ({ label: t.checkout.fields[name], ...form.field(name) });

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.validate(e.currentTarget);
    if (!values || !user) return;
    setSubmitting(true);
    // Simulated payment round-trip.
    await new Promise((r) => setTimeout(r, 1200));
    const id = `NV-${Date.now().toString(36).slice(-6).toUpperCase()}`;
    addOrder({
      id,
      userId: user.id,
      createdAt: new Date().toISOString(),
      lines: cart.lines.map((line) => ({
        productId: line.productId,
        name: line.product.name,
        image: imagesForColor(line.product, line.color)[0] ?? "",
        color: line.color,
        size: line.size,
        quantity: line.quantity,
        unitPrice: line.product.price,
      })),
      subtotal: cart.subtotal,
      shipping: shippingCost,
      total,
      currency,
      rate,
      shipCity: values.city,
      shipCountry: values.country,
    });
    setConfirmation({ order: id, email: values.email });
    clearCart();
    setSubmitting(false);
    window.scrollTo({ top: 0 });
  };

  if (confirmation) {
    return (
      <div className="container-nova pt-16 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-2xl flex-col items-start gap-6"
          role="status"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-moss text-paper">
            <Icon name="check" size={26} />
          </span>
          <p className="label text-moss">{t.checkout.successEyebrow}</p>
          <h1 className="font-display text-display tracking-tightest italic">
            {t.checkout.successTitle}
          </h1>
          <p className="text-lg text-ink-soft">
            {t.checkout.successBody(confirmation.order, confirmation.email)}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/account" size="lg">
              {t.nav.account}
            </ButtonLink>
            <ButtonLink to="/shop" size="lg" variant="outline">
              {t.checkout.successCta}
            </ButtonLink>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!cart.loading && cart.lines.length === 0) {
    return (
      <div className="container-nova pt-10 md:pt-16">
        <SectionHeading as="h1" size="lg" title={t.checkout.title} />
        <EmptyState
          title={t.checkout.emptyTitle}
          body={t.cart.emptyBody}
          action={<ButtonLink to="/shop">{t.common.continueShopping}</ButtonLink>}
        />
      </div>
    );
  }

  const countries = Object.entries(t.checkout.countries).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="container-nova pt-10 md:pt-16">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading as="h1" size="lg" title={t.checkout.title}>
          {user && <p className="text-sm text-stone">{t.checkout.signedInAs(user.email)}</p>}
        </SectionHeading>
        <p className="flex items-center gap-2 text-sm text-stone">
          <Icon name="lock" size={16} />
          {t.checkout.secure}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <aside className="lg:order-2 lg:col-span-4 lg:col-start-9" aria-label={t.cart.orderSummary}>
          <div className="bg-bone/70 p-6 md:p-8 lg:sticky lg:top-28">
            <button
              type="button"
              className="flex w-full items-center justify-between lg:pointer-events-none"
              aria-expanded={showSummary}
              onClick={() => {
                setShowSummary((s) => !s);
              }}
            >
              <span className="label">{t.cart.orderSummary}</span>
              <span className="flex items-center gap-2 font-display text-xl tabular-nums lg:hidden">
                {money(total)}
                <Icon
                  name="chevronDown"
                  size={16}
                  className={cn("transition-transform", showSummary && "rotate-180")}
                />
              </span>
            </button>
            <div className={cn("mt-6 flex-col gap-6", showSummary ? "flex" : "hidden lg:flex")}>
              <ul className="divide-y divide-line border-y border-line">
                {cart.lines.map((line) => (
                  <li key={line.key}>
                    <CartLineItem line={line} compact />
                  </li>
                ))}
              </ul>
              <OrderTotals subtotal={cart.subtotal} shipping={shippingCost} />
            </div>
          </div>
        </aside>

        <form
          noValidate
          onSubmit={onSubmit}
          className="flex flex-col gap-12 lg:order-1 lg:col-span-7"
        >
          {form.submitted && form.errorCount > 0 && (
            <FormAlert>{t.checkout.errorSummaryTitle(form.errorCount)}</FormAlert>
          )}

          <Fieldset step={1} title={t.checkout.contact}>
            <TextField
              {...field("email")}
              type="email"
              autoComplete="email"
              inputMode="email"
              dir="ltr"
            />
            <TextField
              {...field("phone")}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              dir="ltr"
            />
          </Fieldset>

          <Fieldset step={2} title={t.checkout.shippingAddress}>
            <TextField {...field("firstName")} autoComplete="given-name" />
            <TextField {...field("lastName")} autoComplete="family-name" />
            <TextField
              {...field("address")}
              autoComplete="address-line1"
              wrapperClassName="sm:col-span-2"
            />
            <TextField
              {...field("apartment")}
              autoComplete="address-line2"
              optionalLabel={t.common.optional}
              wrapperClassName="sm:col-span-2"
            />
            <TextField {...field("city")} autoComplete="address-level2" />
            <TextField {...field("postalCode")} autoComplete="postal-code" />
            <SelectField
              {...field("country")}
              autoComplete="country"
              options={countries}
              wrapperClassName="sm:col-span-2"
            />
          </Fieldset>

          <fieldset className="flex flex-col gap-5 border-t border-line pt-8">
            <legend className="float-left mb-2 flex w-full items-baseline gap-3">
              <span className="font-display text-xl text-clay italic">03</span>
              <span className="font-display text-2xl">{t.checkout.delivery}</span>
            </legend>
            <div className="clear-both grid gap-3 sm:grid-cols-2">
              {(Object.keys(SHIPPING_RATES) as ShippingMethod[]).map((method) => {
                const option = t.checkout.deliveryOptions[method];
                const cost = costOf(method);
                return (
                  <label key={method} className="cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      value={method}
                      checked={shipping === method}
                      onChange={() => {
                        setShipping(method);
                      }}
                      className="peer sr-only"
                    />
                    <span className="flex items-center justify-between border border-line bg-white p-5 transition-colors peer-checked:border-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink hover:border-stone">
                      <span className="flex flex-col gap-1">
                        <span>{option.label}</span>
                        <span className="text-[0.8125rem] text-stone">{option.detail}</span>
                      </span>
                      <span className="tabular-nums">
                        {cost === 0 ? t.cart.shippingFree : money(cost)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Fieldset step={4} title={t.checkout.payment}>
            <p className="text-[0.8125rem] text-stone sm:col-span-2">
              {t.checkout.chargedIn(currencyName(currency, INTL_LOCALE[locale]))}{" "}
              {t.checkout.paymentNote}
            </p>
            <TextField
              {...field("cardName")}
              autoComplete="cc-name"
              wrapperClassName="sm:col-span-2"
            />
            <TextField
              {...field("cardNumber")}
              autoComplete="cc-number"
              inputMode="numeric"
              placeholder="1234 1234 1234 1234"
              dir="ltr"
              wrapperClassName="sm:col-span-2"
            />
            <TextField
              {...field("expiry")}
              autoComplete="cc-exp"
              inputMode="numeric"
              placeholder="MM / YY"
              dir="ltr"
            />
            <TextField
              {...field("cvc")}
              autoComplete="cc-csc"
              inputMode="numeric"
              maxLength={4}
              placeholder="123"
              dir="ltr"
            />
          </Fieldset>

          <Button type="submit" size="lg" block disabled={submitting || cart.loading}>
            {submitting ? (
              <>
                <motion.span
                  className="size-4 rounded-full border-2 border-paper/30 border-t-paper"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  aria-hidden="true"
                />
                {t.checkout.processing}
              </>
            ) : (
              t.checkout.placeOrder(money(total))
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
