import { Link } from "react-router";
import { useI18n } from "@/i18n";
import { CATEGORIES } from "@/lib/constants";
import { useCurrentUser } from "@/store/session";
import { CurrencyButton } from "./CurrencyPicker";
import { LanguageToggle } from "./Header";

export function Footer() {
  const { t, l } = useI18n();
  const year = new Date().getFullYear();

  const user = useCurrentUser();
  const account = [
    user ? { to: "/account", label: t.nav.account } : { to: "/login", label: t.nav.signIn },
    { to: "/wishlist", label: t.nav.wishlist },
    { to: "/cart", label: t.cart.title },
    { to: "/search", label: t.nav.search },
  ];

  return (
    <footer className="mt-32 border-t border-line bg-bone/60">
      <div className="container-nova grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="max-w-sm font-display text-3xl leading-tight text-balance">
            {t.footer.tagline}
          </p>
        </div>
        <nav aria-label={t.footer.shop} className="md:col-span-3">
          <h2 className="label mb-5 text-stone">{t.footer.shop}</h2>
          <ul className="flex flex-col gap-2.5 text-[0.9375rem]">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/shop?category=${c.id}`} className="hover:text-clay">
                  {l(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t.footer.account} className="md:col-span-2">
          <h2 className="label mb-5 text-stone">{t.footer.account}</h2>
          <ul className="flex flex-col gap-2.5 text-[0.9375rem]">
            {account.map((a) => (
              <li key={a.to}>
                <Link to={a.to} className="hover:text-clay">
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <h2 className="label mb-5 text-stone">{t.footer.contact}</h2>
          <address className="flex flex-col gap-2.5 text-[0.9375rem] not-italic">
            <span>{t.footer.address}</span>
            <a href="mailto:care@nova.studio" className="hover:text-clay" dir="ltr">
              care@nova.studio
            </a>
            <span className="text-sm text-stone">{t.footer.hours}</span>
          </address>
        </div>
      </div>

      <div aria-hidden="true" className="container-nova overflow-hidden">
        <p className="-mb-[0.18em] font-display text-[26vw] leading-none tracking-tightest text-ink/90 select-none md:text-[22vw]">
          Nova
        </p>
      </div>

      <div className="border-t border-line">
        <div className="container-nova flex flex-col gap-3 py-6 text-xs text-stone md:flex-row md:items-center md:justify-between">
          <p>{t.footer.rights(year)}</p>
          <p>{t.footer.demo}</p>
          <div className="flex items-center gap-2">
            <span>{t.footer.language}:</span>
            <LanguageToggle compact />
            <span aria-hidden="true">·</span>
            <CurrencyButton className="h-auto px-0 text-xs text-ink" />
          </div>
        </div>
      </div>
    </footer>
  );
}
