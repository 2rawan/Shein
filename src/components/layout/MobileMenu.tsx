import { Link } from "react-router";
import { Drawer } from "@/components/ui/Drawer";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n";
import { CATEGORIES } from "@/lib/constants";
import { useUi } from "@/store/ui";
import { LanguageToggle } from "./Header";

export function MobileMenu() {
  const { t, l } = useI18n();
  const open = useUi((s) => s.menuOpen);
  const setMenuOpen = useUi((s) => s.setMenuOpen);
  const close = () => {
    setMenuOpen(false);
  };

  const primary = [
    { to: "/shop", label: t.nav.shop },
    { to: "/shop?sort=newest", label: t.nav.newIn },
    { to: "/wishlist", label: t.nav.wishlist },
    { to: "/search", label: t.nav.search },
  ];

  return (
    <Drawer
      open={open}
      onClose={close}
      title={t.nav.menu}
      side="start"
      footer={<LanguageToggle className="-ms-2" />}
    >
      <nav aria-label={t.nav.primary} className="flex flex-col px-6 py-8">
        <ul className="flex flex-col gap-1">
          {primary.map((item) => (
            <li key={item.to}>
              <Link to={item.to} onClick={close} className="block py-2 font-display text-3xl">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-10 flex flex-col border-t border-line">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="border-b border-line">
              <Link
                to={`/shop?category=${c.id}`}
                onClick={close}
                className="flex items-center justify-between py-4 text-[0.9375rem]"
              >
                {l(c.name)}
                <Icon name="chevron" size={16} flipRtl />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}
