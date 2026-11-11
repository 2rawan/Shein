import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ColorSwatches, SizeSelector } from "@/components/product/VariantPickers";
import { WishlistButton } from "@/components/product/WishlistButton";
import { AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { Skeleton } from "@/components/ui/Skeleton";
import { Rating, SectionHeading } from "@/components/ui/Typography";
import { useDocumentTitle } from "@/hooks/useDom";
import { useProducts } from "@/hooks/useProducts";
import { useI18n } from "@/i18n";
import { relatedProducts } from "@/lib/catalog";
import { CATEGORY_BY_ID } from "@/lib/constants";
import type { ColorId, Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import NotFoundPage from "./NotFoundPage";

function ProductSkeleton() {
  return (
    <div className="container-nova grid gap-10 pt-8 lg:grid-cols-12" role="status">
      <Skeleton className="aspect-[4/5] lg:col-span-7" />
      <div className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="mt-8 h-24 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}

function ProductDetails({ product, all }: { product: Product; all: Product[] }) {
  const { t, l } = useI18n();
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  const announce = useUi((s) => s.announce);

  const oneSize = product.sizes.length === 1;
  const firstAvailable = product.sizes.find((s) => !product.soldOutSizes?.includes(s)) ?? null;
  const [color, setColor] = useState<ColorId>(product.colors[0] ?? "black");
  const [size, setSize] = useState<string | null>(oneSize ? firstAvailable : null);
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const name = l(product.name);
  const category = CATEGORY_BY_ID[product.category];
  const related = useMemo(() => relatedProducts(all, product), [all, product]);
  const allSoldOut = firstAvailable === null;
  useDocumentTitle(name);

  useEffect(() => {
    if (!justAdded) return;
    const id = window.setTimeout(() => {
      setJustAdded(false);
    }, 1800);
    return () => {
      window.clearTimeout(id);
    };
  }, [justAdded]);

  const handleAdd = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    add({ productId: product.id, color, size });
    setJustAdded(true);
    announce(t.product.addedToBag(name));
    window.setTimeout(openCart, 650);
  };

  return (
    <>
      <div className="container-nova pt-6 md:pt-10">
        <nav aria-label={t.product.breadcrumb} className="mb-6 text-[0.8125rem] text-stone">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-ink">
                {t.nav.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`/shop?category=${category.id}`} className="hover:text-ink">
                {l(category.name)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={name} />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="flex flex-col gap-8 lg:sticky lg:top-28">
              <div className="flex flex-col gap-4">
                {product.tags[0] && (
                  <p className="label text-clay">{t.product.tags[product.tags[0]]}</p>
                )}
                <h1 className="font-display text-display-sm font-normal tracking-tightest text-balance">
                  {name}
                </h1>
                <div className="flex items-center justify-between">
                  <Price
                    amount={product.price}
                    compareAt={product.compareAtPrice}
                    className="text-lg"
                  />
                  <span className="flex items-center gap-2 text-sm text-stone">
                    <Rating value={product.rating} label={t.product.rating(product.rating)} />
                    <span>· {t.product.reviews(product.reviewCount)}</span>
                  </span>
                </div>
              </div>

              <ColorSwatches colors={product.colors} value={color} onChange={setColor} />

              {!oneSize && (
                <div className="flex flex-col gap-3">
                  <SizeSelector
                    sizes={product.sizes}
                    soldOut={product.soldOutSizes}
                    value={size}
                    onChange={(s) => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    error={sizeError ? t.product.sizeRequired : undefined}
                  />
                  <p className="text-[0.8125rem] text-stone">{t.product.fitNote}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  size="lg"
                  block
                  onClick={handleAdd}
                  disabled={allSoldOut}
                  className="overflow-hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={allSoldOut ? "sold" : justAdded ? "added" : "add"}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="inline-flex items-center gap-2"
                    >
                      {allSoldOut ? (
                        t.product.soldOut
                      ) : justAdded ? (
                        <>
                          <Icon name="check" size={18} /> {t.product.added}
                        </>
                      ) : (
                        <>
                          <Icon name="bag" size={18} /> {t.product.addToBag}
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </Button>
                <WishlistButton product={product} variant="inline" />
              </div>

              <div className="border-t border-line">
                <AccordionItem title={t.product.details} defaultOpen>
                  {l(product.description)}
                </AccordionItem>
                <AccordionItem title={t.product.materialCare}>
                  <p className="mb-2 text-ink">{l(product.material)}</p>
                  {t.product.careText}
                </AccordionItem>
                <AccordionItem title={t.product.shippingReturns}>
                  {t.product.shippingText}
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-nova mt-28">
          <SectionHeading title={t.product.youMayAlsoLike} className="mb-10" />
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { products, status } = useProducts();

  if (status === "loading") return <ProductSkeleton />;
  const product = products?.find((p) => p.id === id);
  if (!product || !products) return <NotFoundPage />;
  // Keyed so variant state resets when navigating between products.
  return <ProductDetails key={product.id} product={product} all={products} />;
}
