import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type SyntheticEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n";
import { email as validateEmail } from "@/lib/validation";

export function Principles() {
  const { t } = useI18n();
  return (
    <section className="container-nova py-20 md:py-32">
      <p className="label mb-12 text-stone">{t.home.principlesEyebrow}</p>
      <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
        {t.home.principles.map((p, i) => (
          <motion.li
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 border-t border-ink pt-6"
          >
            <span className="font-display text-5xl text-clay italic tabular-nums">0{i + 1}</span>
            <h3 className="font-display text-2xl">{p.title}</h3>
            <p className="max-w-xs leading-relaxed text-ink-soft">{p.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export function Newsletter() {
  const { t } = useI18n();
  const id = useId();
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "invalid" | "done">("idle");

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(validateEmail(value) ? "invalid" : "done");
  };

  return (
    <section className="container-nova">
      <div className="grid gap-10 border-y border-line py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <h2 className="font-display text-display-sm tracking-tightest">
            {t.home.newsletterTitle}
          </h2>
          <p className="mt-4 max-w-sm text-ink-soft">{t.home.newsletterBody}</p>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:self-end">
          <AnimatePresence mode="wait" initial={false}>
            {state === "done" ? (
              <motion.p
                key="done"
                role="status"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl italic"
              >
                {t.home.newsletterSuccess}
              </motion.p>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }}>
                <label htmlFor={id} className="label mb-3 block text-stone">
                  {t.home.newsletterLabel}
                </label>
                <div className="flex border-b border-ink">
                  <input
                    id={id}
                    type="email"
                    autoComplete="email"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      if (state === "invalid") setState("idle");
                    }}
                    placeholder={t.home.newsletterPlaceholder}
                    aria-invalid={state === "invalid" ? true : undefined}
                    aria-describedby={state === "invalid" ? `${id}-error` : undefined}
                    className="h-14 flex-1 bg-transparent text-lg placeholder:text-stone/60 focus:outline-none"
                    dir="ltr"
                  />
                  <Button type="submit" variant="ghost" className="px-0">
                    {t.home.newsletterSubmit}
                  </Button>
                </div>
                {state === "invalid" && (
                  <p id={`${id}-error`} role="alert" className="mt-3 text-[0.8125rem] text-danger">
                    {t.home.newsletterInvalid}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
