import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";
import { useUi } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import { Icon } from "@/components/ui/Icon";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  variant?: "overlay" | "inline";
}

export function WishlistButton({ product, className, variant = "overlay" }: WishlistButtonProps) {
  const { t, l } = useI18n();
  const saved = useWishlist((s) => s.ids.includes(product.id));
  const toggle = useWishlist((s) => s.toggle);
  const announce = useUi((s) => s.announce);
  const name = l(product.name);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t.product.removeFromWishlist(name) : t.product.addToWishlist(name)}
      onClick={(e) => {
        // Cards wrap the whole tile in a link; keep the heart from navigating.
        e.preventDefault();
        e.stopPropagation();
        toggle(product.id);
        announce(saved ? t.product.removedFromWishlist(name) : t.product.savedToWishlist(name));
      }}
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-300",
        variant === "overlay"
          ? "size-10 bg-paper/80 text-ink backdrop-blur-sm hover:bg-paper"
          : "size-14 border border-ink text-ink hover:bg-ink hover:text-paper",
        className,
      )}
    >
      <motion.span
        key={saved ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="inline-flex"
      >
        <Icon name="heart" size={18} fill={saved ? "currentColor" : "none"} />
      </motion.span>
    </button>
  );
}
