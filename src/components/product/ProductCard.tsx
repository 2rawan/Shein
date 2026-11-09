import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";
import { Price } from "@/components/ui/Price";
import { SmartImage } from "@/components/ui/SmartImage";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { COLOR_BY_ID } from "@/lib/constants";
import type { Product } from "@/lib/types";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, sizes, priority, className }: ProductCardProps) {
  const { t, l } = useI18n();
  const name = l(product.name);
  const tag = product.compareAtPrice
    ? t.product.sale
    : product.tags[0] && t.product.tags[product.tags[0]];
  const hoverImage = product.images[1];
  const primary = product.images[0] ?? "";
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={cn("group relative flex flex-col", className)}
      onPointerEnter={() => {
        setHovered(true);
      }}
    >
      <Link
        to={`/product/${product.id}`}
        className="flex flex-col gap-4 focus-visible:outline-offset-4"
      >
        <div className="relative overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <SmartImage src={primary} alt={name} sizes={sizes} priority={priority} />
          </motion.div>
          {/* Second look on hover (alternate shot or detail crop), fetched on first hover only. */}
          {hovered && (
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out-soft group-hover:opacity-100">
              <SmartImage
                src={hoverImage ?? primary}
                alt=""
                sizes={sizes}
                zoom={hoverImage ? undefined : 1.7}
                focusY={0.45}
              />
            </div>
          )}
          {tag && (
            <span className="label absolute start-3 top-3 bg-paper px-2 py-1 text-ink">{tag}</span>
          )}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-[0.9375rem] leading-snug">{name}</h3>
            {product.colors.length > 1 && (
              <p className="flex items-center gap-1.5 text-xs text-stone">
                <span className="flex -space-x-1 rtl:space-x-reverse" aria-hidden="true">
                  {product.colors.slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="size-2.5 rounded-full border border-paper ring-1 ring-line"
                      style={{ backgroundColor: COLOR_BY_ID[c].hex }}
                    />
                  ))}
                </span>
                {t.product.colors(product.colors.length)}
              </p>
            )}
          </div>
          <Price
            amount={product.price}
            compareAt={product.compareAtPrice}
            className="shrink-0 text-sm"
          />
        </div>
      </Link>
      <WishlistButton product={product} className="absolute end-3 top-3" />
    </article>
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)} aria-hidden="true">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="flex justify-between gap-6">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-4 w-12" />
      </div>
    </div>
  );
}
