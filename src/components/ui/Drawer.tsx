import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useId, useRef, type ReactNode } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useDom";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { IconButton } from "./Button";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Edge the panel slides in from, in logical (RTL-aware) terms. */
  side?: "start" | "end";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Accessible modal side panel: focus trap, Escape, scroll lock, RTL aware. */
export function Drawer({
  open,
  onClose,
  title,
  side = "end",
  children,
  footer,
  className,
}: DrawerProps) {
  const { t, dir } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  useFocusTrap(panelRef, open, close);
  useLockBodyScroll(open);

  // "end" is the right edge in LTR and the left edge in RTL.
  const fromRight = (side === "end") === (dir === "ltr");
  const offscreen = fromRight ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              "absolute inset-y-0 flex w-full max-w-md flex-col bg-paper shadow-[0_0_60px_rgba(27,25,21,0.18)] outline-none",
              fromRight ? "right-0" : "left-0",
              className,
            )}
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-3">
              <h2 id={titleId} className="label">
                {title}
              </h2>
              <IconButton label={t.common.close} onClick={close} className="-me-3">
                <Icon name="close" />
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer && <div className="border-t border-line px-6 py-5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
