export interface ImageOptions {
  width: number;
  /** Width / height. Defaults to a 4:5 portrait crop. */
  aspect?: number;
  /** Focal-point zoom (> 1) used for detail crops in the product gallery. */
  zoom?: number;
  focusY?: number;
  quality?: number;
}

/** Builds an Unsplash (imgix) URL cropped to the requested size. */
export function imageUrl(base: string, opts: ImageOptions): string {
  const { width, aspect = 4 / 5, zoom, focusY = 0.5, quality = 72 } = opts;
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(Math.round(width)),
    h: String(Math.round(width / aspect)),
    q: String(quality),
  });
  if (zoom && zoom > 1) {
    params.set("crop", "focalpoint");
    params.set("fp-x", "0.5");
    params.set("fp-y", String(focusY));
    params.set("fp-z", String(zoom));
  }
  return `${base}?${params.toString()}`;
}

const SRCSET_WIDTHS = [360, 540, 720, 960, 1280, 1600];

export function imageSrcSet(base: string, opts: Omit<ImageOptions, "width">): string {
  return SRCSET_WIDTHS.map((w) => `${imageUrl(base, { ...opts, width: w })} ${w}w`).join(", ");
}
