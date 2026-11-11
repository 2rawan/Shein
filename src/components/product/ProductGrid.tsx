import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";

interface ProductGridProps {
  products: Product[] | null;
  /** Editorial rhythm: every 7th tile spans two columns and rows on large screens. */
  feature?: boolean;
  skeletonCount?: number;
  className?: string;
}

const isFeatured = (i: number) => i % 7 === 4;

export function ProductGrid({
  products,
  feature = false,
  skeletonCount = 8,
  className,
}: ProductGridProps) {
  const { t } = useI18n();
  const grid = cn(
    "grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-flow-dense",
    feature ? "lg:grid-cols-4" : "xl:grid-cols-4",
    className,
  );

  if (!products) {
    return (
      <div className={grid} role="status" aria-label={t.common.loading}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <ul className={grid}>
      {products.map((product, i) => {
        const big = feature && isFeatured(i);
        return (
          <motion.li
            key={product.id}
            layout="position"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className={big ? "lg:col-span-2 lg:row-span-2" : undefined}
          >
            <ProductCard
              product={product}
              priority={i < 4}
              sizes={
                big
                  ? "(min-width: 1024px) 50vw, (min-width: 768px) 33vw, 50vw"
                  : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              }
            />
          </motion.li>
        );
      })}
    </ul>
  );
}
