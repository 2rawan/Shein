import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { ActiveFilters, SortSelect } from "@/components/shop/ShopControls";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Icon } from "@/components/ui/Icon";
import { EmptyState, SectionHeading } from "@/components/ui/Typography";
import { useDocumentTitle } from "@/hooks/useDom";
import { useProducts } from "@/hooks/useProducts";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useI18n } from "@/i18n";
import { availableColors, availableSizes, filterProducts, priceBounds } from "@/lib/catalog";
import { CATEGORY_BY_ID } from "@/lib/constants";

export default function ShopPage() {
  const { t, l } = useI18n();
  const { products } = useProducts();
  const { filters, toggle, setPrice, setSort, clear, activeCount } = useShopFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const facets = useMemo(() => {
    const all = products ?? [];
    const counts: Record<string, number> = {};
    for (const p of all) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return {
      bounds: priceBounds(all),
      sizes: availableSizes(all),
      colors: availableColors(all),
      counts,
    };
  }, [products]);

  const results = useMemo(
    () => (products ? filterProducts(products, filters) : null),
    [products, filters],
  );

  const singleCategory = filters.categories.length === 1 ? filters.categories[0] : undefined;
  const title = singleCategory ? l(CATEGORY_BY_ID[singleCategory].name) : t.shop.title;
  useDocumentTitle(title);

  const panel = (
    <FilterPanel
      filters={filters}
      bounds={facets.bounds}
      sizes={facets.sizes}
      colors={facets.colors}
      counts={facets.counts}
      onToggle={toggle}
      onPrice={setPrice}
    />
  );

  return (
    <div className="container-nova pt-10 md:pt-16">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <SectionHeading as="h1" size="lg" eyebrow={t.shop.eyebrow} title={title} />
        <p className="text-sm text-stone tabular-nums" aria-live="polite">
          {results && t.shop.resultCount(results.length)}
        </p>
      </div>

      <div className="sticky top-16 z-20 -mx-5 mb-8 flex items-center justify-between border-y border-line bg-paper/95 px-5 py-2 backdrop-blur-md md:top-20 md:-mx-10 md:px-10 lg:static lg:mx-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
        <Button
          variant="ghost"
          className="h-10 px-0 lg:hidden"
          onClick={() => {
            setFiltersOpen(true);
          }}
        >
          <Icon name="filter" size={18} />
          {t.shop.filtersWithCount(activeCount)}
        </Button>
        <p className="label hidden lg:block">{t.shop.filters}</p>
        <SortSelect value={filters.sort} onChange={setSort} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[15rem_1fr] xl:grid-cols-[17rem_1fr] xl:gap-14">
        <aside aria-label={t.shop.filters} className="hidden lg:block">
          <div className="sticky top-28">{panel}</div>
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          <ActiveFilters
            filters={filters}
            onToggle={toggle}
            onClearPrice={() => {
              setPrice(null, null);
            }}
            onClearAll={clear}
          />
          {results?.length === 0 ? (
            <EmptyState
              title={t.shop.noResultsTitle}
              body={t.shop.noResultsBody}
              action={
                <Button variant="outline" onClick={clear}>
                  {t.shop.clearAll}
                </Button>
              }
            />
          ) : (
            <ProductGrid products={results} feature={activeCount === 0} skeletonCount={9} />
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => {
          setFiltersOpen(false);
        }}
        title={t.shop.filters}
        side="start"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={clear} disabled={!activeCount}>
              {t.shop.clearAll}
            </Button>
            <Button
              onClick={() => {
                setFiltersOpen(false);
              }}
            >
              {t.shop.showResults(results?.length ?? 0)}
            </Button>
          </div>
        }
      >
        <div className="px-6 py-6">{panel}</div>
      </Drawer>
    </div>
  );
}
