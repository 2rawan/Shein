import { useRef } from "react";
import { Link } from "react-router";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/Typography";
import { useI18n } from "@/i18n";
import type { Product } from "@/lib/types";

export function NewArrivals({ products }: { products: Product[] | null }) {
  const { t, dir } = useI18n();
  const railRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    // scrollLeft runs negative in RTL, so flip the delta.
    const delta = direction * rail.clientWidth * 0.8 * (dir === "rtl" ? -1 : 1);
    rail.scrollBy({ left: delta, behavior: "smooth" });
  };

  const items = products
    ? [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10)
    : null;

  return (
    <section className="py-20 md:py-28">
      <div className="container-nova mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow={t.home.newInEyebrow} title={t.home.newInTitle}>
          <p className="max-w-md text-ink-soft">{t.home.newInBody}</p>
        </SectionHeading>
        <div className="flex items-center gap-4">
          <Link to="/shop?sort=newest" className="link-underline text-sm">
            {t.common.viewAll}
          </Link>
          <div className="hidden gap-1 md:flex">
            <IconButton
              label={t.home.railPrev}
              onClick={() => {
                scroll(-1);
              }}
              className="border border-line"
            >
              <Icon name="arrow" size={18} className="rotate-180 rtl:rotate-0" />
            </IconButton>
            <IconButton
              label={t.home.railNext}
              onClick={() => {
                scroll(1);
              }}
              className="border border-line"
            >
              <Icon name="arrow" size={18} flipRtl />
            </IconButton>
          </div>
        </div>
      </div>
      <ul
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 md:scroll-px-10 md:gap-6 md:px-10 xl:scroll-px-14 xl:px-14"
      >
        {(items ?? Array.from({ length: 5 }, () => null)).map((p, i) => (
          <li
            key={p?.id ?? i}
            className="w-[68vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] xl:w-[22vw]"
          >
            {p ? (
              <ProductCard
                product={p}
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 68vw"
              />
            ) : (
              <ProductCardSkeleton />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
