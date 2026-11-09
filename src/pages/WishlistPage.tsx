import { ProductGrid } from "@/components/product/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, SectionHeading } from "@/components/ui/Typography";
import { useDocumentTitle } from "@/hooks/useDom";
import { useProducts } from "@/hooks/useProducts";
import { useI18n } from "@/i18n";
import { useWishlist } from "@/store/wishlist";

export default function WishlistPage() {
  const { t } = useI18n();
  const ids = useWishlist((s) => s.ids);
  const { products } = useProducts();
  useDocumentTitle(t.meta.wishlist);

  const saved = products
    ? ids.flatMap((id) => {
        const p = products.find((x) => x.id === id);
        return p ? [p] : [];
      })
    : null;

  return (
    <div className="container-nova pt-10 md:pt-16">
      <div className="mb-12 flex items-end justify-between gap-6">
        <SectionHeading as="h1" size="lg" title={t.wishlist.title} />
        {saved && saved.length > 0 && (
          <p className="text-sm text-stone">{t.wishlist.count(saved.length)}</p>
        )}
      </div>
      {saved?.length === 0 ? (
        <EmptyState
          title={t.wishlist.emptyTitle}
          body={t.wishlist.emptyBody}
          action={<ButtonLink to="/shop">{t.common.shopNow}</ButtonLink>}
        />
      ) : (
        <ProductGrid products={saved} skeletonCount={Math.max(ids.length, 1)} />
      )}
    </div>
  );
}
