import { motion } from "framer-motion";
import { Link } from "react-router";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { useI18n } from "@/i18n";

const HERO_MAIN = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b";
const HERO_INSET = "https://images.unsplash.com/photo-1581044777550-4cfa60707c03";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative container-nova grid gap-10 pt-8 pb-20 md:grid-cols-12 md:gap-6 md:pt-14 md:pb-32">
      <div className="relative z-10 flex flex-col justify-between gap-10 md:col-span-6 md:row-start-1 lg:col-span-5">
        <motion.p {...rise(0)} className="label text-stone">
          {t.home.season}
        </motion.p>
        <h1 className="font-display text-display-lg font-normal tracking-tightest">
          <motion.span {...rise(0.08)} className="block">
            {t.home.heroTitleA}
          </motion.span>
          <motion.span {...rise(0.16)} className="block ps-[0.12em] italic md:ps-[0.6em]">
            {t.home.heroTitleB}
          </motion.span>
          <motion.span
            {...rise(0.24)}
            className="mt-5 block text-display-sm tracking-normal text-ink-soft md:mt-8"
          >
            {t.home.heroTitleC}
          </motion.span>
        </h1>
        <motion.div {...rise(0.34)} className="flex max-w-sm flex-col gap-8">
          <p className="text-[1.0625rem] leading-relaxed text-ink-soft">{t.home.heroBody}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-ink px-7 py-4 text-sm text-paper transition-colors hover:bg-ink-soft"
            >
              {t.home.heroCta}
              <Icon
                name="arrow"
                size={18}
                flipRtl
                className="transition-transform duration-500 ease-editorial group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </Link>
            <Link to="/shop?sort=newest" className="link-underline text-sm">
              {t.home.heroSecondary}
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="relative md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
        <motion.figure
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <SmartImage
            src={HERO_MAIN}
            alt={t.home.heroCaption}
            sizes="(min-width: 768px) 50vw, 100vw"
            aspect={4 / 5}
            focusY={0.3}
            priority
          />
          <figcaption className="mt-3 flex justify-between text-xs text-stone">
            <span>{t.home.heroCaption}</span>
            <span className="tabular-nums">01 / 07</span>
          </figcaption>
        </motion.figure>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -start-[28%] bottom-[14%] hidden w-[38%] border-[10px] border-paper lg:block"
        >
          <SmartImage src={HERO_INSET} alt="" sizes="20vw" aspect={3 / 4} />
        </motion.div>
      </div>
    </section>
  );
}
