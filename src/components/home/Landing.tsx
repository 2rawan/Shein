import { motion } from "framer-motion";
import { Link } from "react-router";
import { AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { SectionHeading } from "@/components/ui/Typography";
import { CurrencyButton } from "@/components/layout/CurrencyPicker";
import { useMoney } from "@/hooks/useMoney";
import { useI18n } from "@/i18n";
import { supportedCurrencies } from "@/lib/currency";
import { useCurrentUser } from "@/store/session";
import { useRates } from "@/store/rates";

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

/** Sign-up invitation for guests; a shortcut to the account for members. */
export function Membership() {
  const { t } = useI18n();
  const user = useCurrentUser();
  return (
    <section className="container-nova py-20 md:py-28">
      <div className="grid gap-10 bg-bone/70 md:grid-cols-12 md:gap-0">
        <div className="md:col-span-5">
          <SmartImage
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae"
            alt=""
            sizes="(min-width: 768px) 40vw, 100vw"
            aspect={4 / 5}
            className="h-full"
          />
        </div>
        <motion.div
          {...reveal}
          className="flex flex-col justify-center gap-8 px-6 pb-10 md:col-span-6 md:col-start-7 md:px-0 md:py-16 md:pe-14"
        >
          {user ? (
            <>
              <SectionHeading
                eyebrow={t.landing.membershipEyebrow}
                title={t.landing.memberTitle(user.firstName)}
              >
                <p className="max-w-md text-ink-soft">{t.landing.memberBody}</p>
              </SectionHeading>
              <ButtonLink to="/account" className="self-start">
                {t.landing.memberCta}
              </ButtonLink>
            </>
          ) : (
            <>
              <SectionHeading
                eyebrow={t.landing.membershipEyebrow}
                title={t.landing.membershipTitle}
              >
                <p className="max-w-md text-ink-soft">{t.landing.membershipBody}</p>
              </SectionHeading>
              <ul className="flex flex-col gap-3">
                {t.landing.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-[0.9375rem]">
                    <Icon name="check" size={16} className="text-clay" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink to="/signup" size="lg">
                  {t.landing.joinCta}
                </ButtonLink>
                <Link to="/login" className="link-underline text-sm">
                  {t.landing.signInCta}
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

const SAMPLE_PRICE = 289;
const SAMPLE_CODES = ["USD", "EUR", "AED", "JOD", "SAR", "GBP"] as const;

export function CurrencyFeature() {
  const { t, locale } = useI18n();
  const rates = useRates((s) => s.rates);
  const money = useMoney();
  const count = supportedCurrencies(rates).length;
  const intl = locale === "ar" ? "ar-AE" : "en-US";
  return (
    <section className="container-nova grid gap-12 py-20 md:grid-cols-12 md:py-28">
      <motion.div {...reveal} className="flex flex-col gap-6 md:col-span-5">
        <SectionHeading eyebrow={t.landing.currencyEyebrow} title={t.landing.currencyTitle(count)}>
          <p className="max-w-md text-ink-soft">{t.landing.currencyBody}</p>
        </SectionHeading>
        <div className="flex items-center gap-4">
          <span className="font-display text-3xl tabular-nums">{money(SAMPLE_PRICE)}</span>
          <CurrencyButton className="border border-ink px-4" />
        </div>
      </motion.div>
      <ul className="grid grid-cols-2 gap-px self-center bg-line md:col-span-6 md:col-start-7 md:grid-cols-3">
        {SAMPLE_CODES.map((code) => (
          <li key={code} className="flex flex-col gap-2 bg-paper p-5">
            <span className="label text-stone" dir="ltr">
              {code}
            </span>
            <span className="font-display text-2xl tabular-nums">
              {new Intl.NumberFormat(intl, {
                style: "currency",
                currency: code,
                currencyDisplay: "narrowSymbol",
                maximumFractionDigits: 0,
              }).format(SAMPLE_PRICE * (rates[code] ?? 1))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Testimonials() {
  const { t } = useI18n();
  return (
    <section className="container-nova py-20 md:py-28">
      <p className="label mb-12 text-stone">{t.landing.testimonialsEyebrow}</p>
      <ul className="grid gap-12 md:grid-cols-3 md:gap-10">
        {t.landing.testimonials.map((item, i) => (
          <motion.li
            key={item.name}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.1 }}
            className={i === 1 ? "md:mt-16" : undefined}
          >
            <figure className="flex flex-col gap-6">
              <blockquote className="font-display text-2xl leading-snug text-balance italic">
                “{item.quote}”
              </blockquote>
              <figcaption className="text-sm text-stone">
                {item.name} — {item.city}
              </figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <section className="container-nova grid gap-10 py-20 md:grid-cols-12 md:py-28">
      <SectionHeading
        eyebrow={t.landing.faqEyebrow}
        title={t.landing.faqTitle}
        className="md:col-span-4"
      />
      <div className="border-t border-line md:col-span-7 md:col-start-6">
        {t.landing.faq.map((item, i) => (
          <AccordionItem key={item.q} title={item.q} defaultOpen={i === 0}>
            {item.a}
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  const { t } = useI18n();
  return (
    <section className="container-nova py-20 text-center md:py-28">
      <p className="mx-auto max-w-3xl font-display text-display tracking-tightest text-balance italic">
        {t.landing.finalTitle}
      </p>
      <ButtonLink to="/shop" size="lg" className="mt-10">
        {t.landing.finalCta}
        <Icon name="arrow" size={18} flipRtl />
      </ButtonLink>
    </section>
  );
}
