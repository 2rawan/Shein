import { motion } from "framer-motion";
import { Link } from "react-router";
import { Price } from "@/components/ui/Price";
import { SmartImage } from "@/components/ui/SmartImage";
import { SectionHeading } from "@/components/ui/Typography";
import { useI18n } from "@/i18n";
import type { Product } from "@/lib/types";

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}`;

/** Asymmetric three-column editorial spread. */
export function EditorialFeature() {
  const { t } = useI18n();
  return (
    <section className="container-nova grid grid-cols-12 gap-x-4 gap-y-10 py-20 md:gap-x-6 md:py-32">
      <motion.div {...reveal} className="col-span-12 md:col-span-5">
        <SmartImage
          src={img("1612336307429-8a898d10e223")}
          alt=""
          sizes="(min-width: 768px) 42vw, 100vw"
          aspect={3 / 4}
        />
      </motion.div>
      <motion.div
        {...reveal}
        className="col-span-12 flex flex-col justify-center gap-6 md:col-span-3 md:col-start-7 md:pt-24"
      >
        <SectionHeading eyebrow={t.home.editorialEyebrow} title={t.home.editorialTitle} />
        <p className="leading-relaxed text-ink-soft">{t.home.editorialBody}</p>
        <Link to="/shop?category=dresses" className="link-underline self-start text-sm">
          {t.home.editorialCta}
        </Link>
      </motion.div>
      <motion.div
        {...reveal}
        className="col-span-8 col-start-5 md:col-span-3 md:col-start-10 md:mt-56"
      >
        <SmartImage src={img("1529139574466-a303027c1d8b")} alt="" sizes="25vw" aspect={2 / 3} />
      </motion.div>
    </section>
  );
}

const LOOK_IDS = ["everyday-poplin-shirt", "selvedge-straight-jean", "bruno-leather-derby"];

export function Lookbook({ products }: { products: Product[] | null }) {
  const { t, l } = useI18n();
  const look = LOOK_IDS.map((id) => products?.find((p) => p.id === id)).filter((p): p is Product =>
    Boolean(p),
  );

  return (
    <section className="bg-ink text-paper">
      <div className="grid md:grid-cols-12">
        <div className="md:col-span-7">
          <SmartImage
            src={img("1617137968427-85924c800a22")}
            alt={t.home.lookbookBody}
            sizes="(min-width: 768px) 58vw, 100vw"
            aspect={4 / 5}
            focusY={0.3}
          />
        </div>
        <div className="flex flex-col justify-between gap-12 px-5 py-14 md:col-span-5 md:px-12 md:py-20 xl:px-20">
          <motion.div {...reveal} className="flex flex-col gap-5">
            <p className="label text-paper/60">{t.home.lookbookEyebrow}</p>
            <h2 className="font-display text-display font-normal tracking-tightest italic">
              {t.home.lookbookTitle}
            </h2>
            <p className="max-w-sm leading-relaxed text-paper/75">{t.home.lookbookBody}</p>
          </motion.div>
          <div>
            <p className="label mb-4 text-paper/60">{t.home.shopTheLook}</p>
            <ul className="border-t border-paper/20">
              {look.map((p, i) => (
                <li key={p.id} className="border-b border-paper/20">
                  <Link to={`/product/${p.id}`} className="group flex items-center gap-4 py-4">
                    <span className="w-6 text-xs text-paper/50 tabular-nums">0{i + 1}</span>
                    <span className="w-12 shrink-0">
                      <SmartImage src={p.images[0] ?? ""} alt="" sizes="48px" />
                    </span>
                    <span className="flex-1 transition-colors group-hover:text-clay-soft">
                      {l(p.name)}
                    </span>
                    <Price amount={p.price} className="text-sm text-paper/80" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
