import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ScrollRestoration, useLocation, useOutlet } from "react-router";
import { useDocumentLocale, useI18n } from "@/i18n";
import { useUi } from "@/store/ui";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";

export function Layout() {
  useDocumentLocale();
  const { t, locale } = useI18n();
  const location = useLocation();
  const outlet = useOutlet();
  const announcement = useUi((s) => s.announcement);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed start-4 top-4 z-[60] -translate-y-24 bg-ink px-4 py-3 text-sm text-paper transition-transform focus:translate-y-0"
      >
        {t.common.skipToContent}
      </a>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          // Language switches re-key too, so the RTL flip reads as a deliberate transition.
          key={`${location.pathname}-${locale}`}
          id="main"
          tabIndex={-1}
          className="outline-none"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <MobileMenu />
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      <ScrollRestoration />
    </MotionConfig>
  );
}
