import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            setOpen((o) => !o);
          }}
          className="flex w-full items-center justify-between py-5 text-start text-[0.9375rem]"
        >
          {title}
          <Icon
            name="plus"
            size={16}
            className={`transition-transform duration-500 ease-editorial ${open ? "rotate-45" : ""}`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[0.9375rem] leading-relaxed text-ink-soft">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
