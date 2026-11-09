import { ButtonLink } from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDom";
import { useI18n } from "@/i18n";

export default function NotFoundPage() {
  const { t } = useI18n();
  useDocumentTitle(t.meta.notFound);
  return (
    <div className="container-nova grid gap-10 pt-16 pb-10 md:grid-cols-12 md:pt-28">
      <p
        aria-hidden="true"
        className="font-display text-display-lg leading-none text-sand italic md:col-span-5"
      >
        {t.notFound.code}
      </p>
      <div className="flex flex-col items-start gap-6 md:col-span-6 md:col-start-7 md:pt-6">
        <h1 className="font-display text-display-sm tracking-tightest text-balance">
          {t.notFound.title}
        </h1>
        <p className="max-w-md text-ink-soft">{t.notFound.body}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/">{t.notFound.cta}</ButtonLink>
          <ButtonLink to="/shop" variant="outline">
            {t.nav.shop}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
