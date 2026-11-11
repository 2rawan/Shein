import { CategoryIndex } from "@/components/home/CategoryIndex";
import { EditorialFeature, Lookbook } from "@/components/home/Editorial";
import { Hero } from "@/components/home/Hero";
import {
  CurrencyFeature,
  Faq,
  FinalCta,
  Membership,
  Testimonials,
} from "@/components/home/Landing";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Newsletter, Principles } from "@/components/home/Principles";
import { useDocumentTitle } from "@/hooks/useDom";
import { useProducts } from "@/hooks/useProducts";
import { useI18n } from "@/i18n";

/** Landing page: brand story, membership, currencies and FAQ around the collection. */
export default function HomePage() {
  const { t } = useI18n();
  const { products } = useProducts();
  useDocumentTitle(t.meta.home);

  return (
    <>
      <Hero />
      <NewArrivals products={products} />
      <Membership />
      <EditorialFeature />
      <CategoryIndex products={products} />
      <CurrencyFeature />
      <Lookbook products={products} />
      <Principles />
      <Testimonials />
      <Faq />
      <FinalCta />
      <Newsletter />
    </>
  );
}
