import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { FormAlert } from "@/components/ui/FormControls";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { EmptyState, SectionHeading } from "@/components/ui/Typography";
import { CurrencyButton } from "@/components/layout/CurrencyPicker";
import { LanguageToggle } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDom";
import { useForm } from "@/hooks/useForm";
import { useI18n } from "@/i18n";
import { formatMoney } from "@/lib/currency";
import { formatDate, INTL_LOCALE } from "@/lib/format";
import { required } from "@/lib/validation";
import { useOrders, type Order } from "@/store/orders";
import { useCurrentUser } from "@/store/session";
import type { User } from "@/lib/auth";

function OrderCard({ order }: { order: Order }) {
  const { t, l, locale } = useI18n();
  // Show what the shopper actually paid, in the currency and rate used at checkout.
  const paid = formatMoney(order.total * order.rate, order.currency, INTL_LOCALE[locale]);
  const count = order.lines.reduce((n, line) => n + line.quantity, 0);
  const countries: Record<string, string> = t.checkout.countries;
  return (
    <li className="flex flex-col gap-5 border-t border-line py-6 md:flex-row md:items-center md:gap-8">
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-medium" dir="ltr">
          {t.account.orderNumber(order.id)}
        </p>
        <p className="text-sm text-stone">
          {t.account.placedOn(formatDate(order.createdAt, locale))} · {t.account.itemsCount(count)}
        </p>
        <p className="text-sm text-stone">
          {t.account.shipTo(
            `${order.shipCity}, ${countries[order.shipCountry] ?? order.shipCountry}`,
          )}
        </p>
      </div>
      <ul className="flex gap-2" aria-label={t.account.itemsCount(count)}>
        {order.lines.slice(0, 4).map((line) => (
          <li
            key={`${line.productId}-${line.color}-${line.size}`}
            className="w-12"
            title={l(line.name)}
          >
            <SmartImage src={line.image} alt={l(line.name)} sizes="48px" />
          </li>
        ))}
      </ul>
      <p className="font-display text-xl tabular-nums md:w-36 md:text-end">{paid}</p>
    </li>
  );
}

function ProfileForm({ user }: { user: User }) {
  const { t } = useI18n();
  const { updateProfile, errorMessage } = useAuth();
  const form = useForm({
    rules: { firstName: required, lastName: required },
    initial: { firstName: user.firstName, lastName: user.lastName },
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.validate(e.currentTarget);
    if (!values) return;
    setStatus("saving");
    setError(null);
    try {
      await updateProfile(user.id, values);
      setStatus("saved");
    } catch (err) {
      setError(errorMessage(err));
      setStatus("idle");
    }
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      {error && <FormAlert>{error}</FormAlert>}
      {status === "saved" && <FormAlert tone="success">{t.account.saved}</FormAlert>}
      <TextField
        label={t.auth.fields.firstName}
        {...form.field("firstName")}
        autoComplete="given-name"
      />
      <TextField
        label={t.auth.fields.lastName}
        {...form.field("lastName")}
        autoComplete="family-name"
      />
      <TextField label={t.auth.fields.email} value={user.email} readOnly disabled dir="ltr" />
      <Button type="submit" variant="outline" disabled={status === "saving"} className="self-start">
        {status === "saving" ? t.account.saving : t.account.save}
      </Button>
    </form>
  );
}

export default function AccountPage() {
  const { t, locale } = useI18n();
  const user = useCurrentUser();
  const allOrders = useOrders((s) => s.orders);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle(t.meta.account);

  // RequireAuth guarantees a user; this only satisfies the type checker.
  if (!user) return null;
  const orders = allOrders.filter((o) => o.userId === user.id);

  return (
    <div className="container-nova pt-10 md:pt-16">
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          as="h1"
          size="lg"
          eyebrow={t.account.eyebrow}
          title={t.account.greeting(user.firstName)}
        >
          <p className="text-sm text-stone">
            {t.account.memberSince(formatDate(user.createdAt, locale))}
          </p>
        </SectionHeading>
        <Button
          variant="ghost"
          className="self-start px-0 md:self-auto"
          onClick={() => {
            signOut();
            void navigate("/");
          }}
        >
          <Icon name="logout" size={18} flipRtl />
          {t.account.signOut}
        </Button>
      </div>

      <div className="grid gap-16 lg:grid-cols-12 lg:gap-6">
        <section className="lg:col-span-7" aria-labelledby="orders-heading">
          <h2 id="orders-heading" className="label mb-2">
            {t.account.orders}
          </h2>
          {orders.length === 0 ? (
            <EmptyState
              title={t.account.noOrdersTitle}
              body={t.account.noOrdersBody}
              action={<ButtonLink to="/shop">{t.common.shopNow}</ButtonLink>}
            />
          ) : (
            <ul className="border-b border-line">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </ul>
          )}
        </section>

        <aside className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9">
          <section aria-labelledby="profile-heading" className="flex flex-col gap-6">
            <h2 id="profile-heading" className="label">
              {t.account.profile}
            </h2>
            <ProfileForm user={user} />
          </section>
          <section aria-labelledby="prefs-heading" className="flex flex-col gap-4">
            <h2 id="prefs-heading" className="label">
              {t.account.preferences}
            </h2>
            <div className="flex items-center justify-between border-y border-line py-2">
              <span className="text-sm text-ink-soft">{t.account.language}</span>
              <LanguageToggle className="-me-2" />
            </div>
            <div className="flex items-center justify-between border-b border-line py-2">
              <span className="text-sm text-ink-soft">{t.account.currency}</span>
              <CurrencyButton className="-me-2" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
