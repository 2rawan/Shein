import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/Typography";
import { useDebouncedValue, useDocumentTitle } from "@/hooks/useDom";
import { useProducts } from "@/hooks/useProducts";
import { useI18n } from "@/i18n";
import { searchProducts } from "@/lib/catalog";
import { CATEGORY_BY_ID, COLOR_BY_ID } from "@/lib/constants";

export default function SearchPage() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const debounced = useDebouncedValue(query, 180);
  const { products } = useProducts();
  useDocumentTitle(query ? `${t.meta.search}: ${query}` : t.meta.search);

  const setQuery = (q: string) => {
    setParams(q ? { q } : {}, { replace: true });
  };

  // Match category and colour names in both languages as well as product text.
  const results = useMemo(
    () =>
      products
        ? searchProducts(products, debounced, (p) => [
            CATEGORY_BY_ID[p.category].name.en,
            CATEGORY_BY_ID[p.category].name.ar,
            ...p.colors.flatMap((c) => [COLOR_BY_ID[c].name.en, COLOR_BY_ID[c].name.ar]),
          ])
        : null,
    [products, debounced],
  );

  const trimmed = debounced.trim();

  return (
    <div className="container-nova pt-10 md:pt-16">
      <h1 className="sr-only">{t.search.title}</h1>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="relative mb-12 border-b border-ink"
      >
        <label htmlFor="search-input" className="label mb-3 block text-stone">
          {t.search.label}
        </label>
        <div className="flex items-center gap-3">
          <Icon name="search" size={28} className="shrink-0 text-stone" />
          <input
            id="search-input"
            type="search"
            // Search is the page's sole purpose, so focusing it on arrival is expected.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder={t.search.placeholder}
            className="h-20 w-full bg-transparent font-display text-3xl placeholder:text-sand focus:outline-none md:h-24 md:text-5xl [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
              }}
              aria-label={t.search.clear}
              className="inline-flex size-11 shrink-0 items-center justify-center hover:text-clay"
            >
              <Icon name="close" />
            </button>
          )}
        </div>
      </form>

      {!trimmed ? (
        <div>
          <h2 className="label mb-5 text-stone">{t.search.popular}</h2>
          <ul className="flex flex-wrap gap-3">
            {t.search.popularTerms.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(term);
                  }}
                  className="h-10 border border-line px-5 text-sm transition-colors hover:border-ink"
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <p className="mb-8 text-sm text-stone" aria-live="polite">
            {results && results.length > 0 && t.search.results(results.length, trimmed)}
          </p>
          {results?.length === 0 ? (
            <EmptyState title={t.search.noResults(trimmed)} body={t.search.noResultsBody} />
          ) : (
            <ProductGrid products={results} />
          )}
        </>
      )}
    </div>
  );
}
