import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { imageSrcSet, imageUrl, type ImageOptions } from "@/lib/image";

interface SmartImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "width" | "height"
> {
  src: string;
  alt: string;
  /** Responsive `sizes` attribute; required so the browser picks the right file. */
  sizes: string;
  aspect?: number;
  zoom?: ImageOptions["zoom"];
  focusY?: ImageOptions["focusY"];
  priority?: boolean;
  wrapperClassName?: string;
}

/**
 * Aspect-locked responsive image that shows a shimmer until loaded, then fades
 * in. Reserving the box up front prevents layout shift.
 */
export function SmartImage({
  src,
  alt,
  sizes,
  aspect = 4 / 5,
  zoom,
  focusY,
  priority = false,
  className,
  wrapperClassName,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const opts = { aspect, zoom, focusY };

  return (
    <div
      className={cn("relative overflow-hidden bg-bone", !loaded && "skeleton", wrapperClassName)}
      style={{ aspectRatio: String(aspect) }}
    >
      <img
        src={imageUrl(src, { ...opts, width: 800 })}
        srcSet={imageSrcSet(src, opts)}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => {
          setLoaded(true);
        }}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out-soft",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
