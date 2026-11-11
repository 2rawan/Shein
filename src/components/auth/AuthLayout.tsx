import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { useI18n } from "@/i18n";

const AUTH_IMAGE = "https://images.unsplash.com/photo-1483985988355-763728e1935b";

interface AuthLayoutProps {
  title: string;
  body?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/** Split editorial layout shared by sign-in, sign-up and password reset. */
export function AuthLayout({ title, body, children, footer }: AuthLayoutProps) {
  const { t } = useI18n();
  return (
    <div className="container-nova grid gap-12 pt-8 md:pt-14 lg:grid-cols-12 lg:gap-6">
      <aside className="relative hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <SmartImage src={AUTH_IMAGE} alt="" sizes="40vw" aspect={4 / 5} focusY={0.3} priority />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-ink/75 to-transparent p-8 pt-24 text-paper">
            <p className="label text-paper/70">{t.auth.asideEyebrow}</p>
            <p className="font-display text-4xl leading-tight text-balance">{t.auth.asideTitle}</p>
            <p className="max-w-sm text-sm leading-relaxed text-paper/80">{t.auth.asideBody}</p>
          </div>
        </div>
      </aside>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8 lg:pt-10"
      >
        <header className="flex flex-col gap-4">
          <h1 className="font-display text-display-sm tracking-tightest text-balance">{title}</h1>
          {body && <div className="max-w-md text-ink-soft">{body}</div>}
        </header>
        {children}
        {footer && <div className="border-t border-line pt-6 text-sm text-ink-soft">{footer}</div>}
      </motion.section>
    </div>
  );
}
