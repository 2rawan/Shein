import { motion } from "framer-motion";
import { Link, NavLink } from "react-router";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/Button";
import { useScrolled } from "@/hooks/useDom";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { CATEGORY_BY_ID } from "@/lib/constants";
import { selectCartCount, useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";

const NAV_CATEGORIES = ["outerwear", "dresses", "knitwear", "accessories"] as const;

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 20 }}
      aria-hidden="true"
      className="absolute end-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[0.625rem] leading-none font-medium text-paper tabular-nums"
    >
      {count}
    </motion.span>
  );
}

export function LanguageToggle({ className, compact }: { className?: string; compact?: boolean }) {
  const { t, locale, setLocale } = useI18n();
  return (
    <button
      type="button"
      onClick={() => {
        setLocale(locale === "en" ? "ar" : "en");
      }}
      aria-label={t.nav.switchLanguageLabel}
      lang={locale === "en" ? "ar" : "en"}
      className={cn(
        "inline-flex items-center transition-colors hover:text-clay",
        compact ? "text-xs text-ink" : "h-11 px-2 text-sm",
        className,
      )}
    >
      {t.nav.switchLanguage}
    </button>
  );
}

const navLink = ({ isActive }: { isActive: boolean }) =>
  cn("py-2 text-sm transition-colors hover:text-clay", isActive && "text-clay");

export function Header() {
  const { t, l } = useI18n();
  const scrolled = useScrolled();
  const cartCount = useCart(selectCartCount);
  const wishCount = useWishlist((s) => s.ids.length);
  const openCart = useUi((s) => s.openCart);
  const setMenuOpen = useUi((s) => s.setMenuOpen);

  return (
    <>
      <p className="bg-ink px-4 py-2 text-center text-[0.75rem] text-paper/85">{t.announcement}</p>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-[background-color,border-color] duration-500",
          scrolled ? "border-line bg-paper/92 backdrop-blur-md" : "border-transparent bg-paper",
        )}
      >
        <div className="container-nova grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
          <div className="flex items-center gap-2">
            <IconButton
              label={t.nav.openMenu}
              className="-ms-3 lg:hidden"
              onClick={() => {
                setMenuOpen(true);
              }}
            >
              <Icon name="menu" />
            </IconButton>
            <nav aria-label={t.nav.primary} className="hidden lg:block">
              <ul className="flex items-center gap-7">
                <li>
                  <NavLink to="/shop" end className={navLink}>
                    {t.nav.shop}
                  </NavLink>
                </li>
                <li>
                  <Link
                    to="/shop?sort=newest"
                    className="py-2 text-sm transition-colors hover:text-clay"
                  >
                    {t.nav.newIn}
                  </Link>
                </li>
                {NAV_CATEGORIES.map((id) => (
                  <li key={id}>
                    <Link
                      to={`/shop?category=${id}`}
                      className="py-2 text-sm transition-colors hover:text-clay"
                    >
                      {l(CATEGORY_BY_ID[id].name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link
            to="/"
            className="font-display text-[1.75rem] tracking-[0.22em] md:text-[2rem] rtl:tracking-normal"
            aria-label={`${t.common.brand} — ${t.nav.home}`}
          >
            NOVA
          </Link>

          <div className="flex items-center justify-end">
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            <Link
              to="/search"
              aria-label={t.nav.search}
              title={t.nav.search}
              className="inline-flex size-11 items-center justify-center transition-colors hover:text-clay"
            >
              <Icon name="search" />
            </Link>
            <Link
              to="/wishlist"
              aria-label={t.nav.wishlistWithCount(wishCount)}
              title={t.nav.wishlist}
              className="relative hidden size-11 items-center justify-center transition-colors hover:text-clay sm:inline-flex"
            >
              <Icon name="heart" />
              <CountBadge count={wishCount} />
            </Link>
            <IconButton label={t.nav.bagWithCount(cartCount)} onClick={openCart} className="-me-3">
              <Icon name="bag" />
              <CountBadge count={cartCount} />
            </IconButton>
          </div>
        </div>
      </header>
    </>
  );
}
