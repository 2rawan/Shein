import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { SectionHeading } from "@/components/ui/Typography";
import { useI18n } from "@/i18n";
import { CATEGORIES } from "@/lib/constants";
import type { CategoryId, Product } from "@/lib/types";

/** Typographic category index; hovering a row reveals its photograph alongside. */
export function CategoryIndex({ products }: { products: Product[] | null }) {
  const { t, l } = useI18n();
  const [active, setActive] = useState<CategoryId>("outerwear");
  const activeCat = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0];
  const counts = products?.reduce<Partial<Record<CategoryId, number>>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="container-nova grid gap-12 py-20 md:grid-cols-12 md:py-28">
      <div className="md:col-span-7">
        <SectionHeading eyebrow={t.home.indexEyebrow} title={t.home.indexTitle} className="mb-10" />
        <ul className="border-t border-line">
          {CATEGORIES.map((c, i) => (
            <li key={c.id} className="border-b border-line">
              <Link
                to={`/shop?category=${c.id}`}
                onPointerEnter={() => {
                  setActive(c.id);
                }}
                onFocus={() => {
                  setActive(c.id);
                }}
                className="group flex items-baseline gap-5 py-5 md:py-6"
              >
                <span className="w-8 text-xs text-stone tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-3xl transition-[color,transform] duration-500 ease-editorial group-hover:translate-x-2 group-hover:text-clay md:text-[2.75rem] rtl:group-hover:-translate-x-2">
                  {l(c.name)}
                </span>
                <span className="text-xs text-stone tabular-nums">{counts?.[c.id] ?? ""}</span>
                <Icon
                  name="arrow"
                  size={18}
                  flipRtl
                  className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative hidden md:col-span-4 md:col-start-9 md:block">
        <div className="sticky top-28">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeCat && (
              <motion.div
                key={activeCat.id}
                initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <SmartImage
                  src={activeCat.image}
                  alt={l(activeCat.name)}
                  sizes="33vw"
                  aspect={3 / 4}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
