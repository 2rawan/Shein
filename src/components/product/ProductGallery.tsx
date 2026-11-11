import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";

interface GalleryFrame {
  src: string;
  zoom?: number;
  focusY?: number;
  alt: string;
}

/**
 * Each catalogue photo yields a full frame plus focal-point detail crops,
 * giving every product a multi-image gallery from a single source shot.
 */
function buildFrames(images: string[], name: string, detailLabel: string): GalleryFrame[] {
  return images.flatMap((src, i) => {
    const frames: GalleryFrame[] = [{ src, alt: name }];
    // Pre-cropped shots are already a detail; zooming further would lose the garment.
    if (i === 0 && !src.includes("?")) {
      frames.push({ src, zoom: 1.8, focusY: 0.35, alt: `${name} — ${detailLabel}` });
      frames.push({ src, zoom: 2.4, focusY: 0.6, alt: `${name} — ${detailLabel}` });
    }
    return frames;
  });
}

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const { t } = useI18n();
  const frames = buildFrames(images, name, t.product.detailView);
  const [active, setActive] = useState(0);
  const current = frames[active] ?? frames[0];

  if (!current) return null;

  return (
    <section
      aria-label={t.product.gallery}
      className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4"
    >
      <div className="relative flex-1 overflow-hidden">
        {/* Mobile: swipeable strip. Desktop: crossfading stage. */}
        <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:hidden">
          {frames.map((f, i) => (
            <div key={`${f.src}-${i}`} className="w-full shrink-0 snap-center">
              <SmartImage
                src={f.src}
                zoom={f.zoom}
                focusY={f.focusY}
                alt={f.alt}
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        <div className="relative hidden lg:block">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            >
              <SmartImage
                src={current.src}
                zoom={current.zoom}
                focusY={current.focusY}
                alt={current.alt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-20 lg:flex-col lg:gap-2">
        {frames.map((f, i) => (
          <button
            key={`${f.src}-${i}`}
            type="button"
            aria-label={t.product.viewImage(i + 1)}
            aria-current={i === active ? "true" : undefined}
            onClick={() => {
              setActive(i);
            }}
            className={cn(
              "w-full shrink-0 border transition-opacity duration-300",
              i === active
                ? "border-ink opacity-100"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <SmartImage src={f.src} zoom={f.zoom} focusY={f.focusY} alt="" sizes="80px" />
          </button>
        ))}
      </div>
    </section>
  );
}
