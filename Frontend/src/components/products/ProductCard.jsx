import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import AddToCartModal from "./AddToCartModal";
import { motion as Motion } from "framer-motion";

const PLACEHOLDER_IMG = "https://placehold.co/400x500?text=Product";

export default function ProductCard({ product, onMobileOpen }) {
  const [modalOpen, setModalOpen] = useState(false);
  const name = product.productName || product.name;
  const description = product.productDesc || product.description || "";
  const categoryLine =
    product.category || product.brand || description.slice(0, 48) || "—";
  const price = product.productPrice ?? product.price;
  const imageUrl =
    product.productImage?.[0]?.url || product.imageUrl || PLACEHOLDER_IMG;
  const productId = product._id;
  const rating =
    product.rating != null && !Number.isNaN(Number(product.rating))
      ? Number(product.rating).toFixed(1)
      : "4.5";

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleCardClick = (e) => {
    if (!onMobileOpen) return;
    if (e.target.closest("[data-no-sheet]")) return;
    onMobileOpen(product);
  };

  const glassPanel = (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 pt-10">
      <div
        className={cn(
          "rounded-2xl border border-white/30 bg-white/15 px-3 py-2.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)]",
          "backdrop-blur-xl backdrop-saturate-150"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate text-sm font-bold leading-tight text-white sm:text-base">
            {name}
          </h3>
          <span className="shrink-0 text-sm font-bold tabular-nums text-white sm:text-base">
            ₹{Number(price).toLocaleString()}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs font-medium text-white/85">
          {categoryLine}
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-white">
          <Star
            className="h-3.5 w-3.5 shrink-0 fill-white text-white"
            aria-hidden
          />
          <span>{rating}</span>
        </div>
      </div>
    </div>
  );

  const addFab = (
    <button
      type="button"
      data-no-sheet
      onClick={handleAddToCartClick}
      className={cn(
        "absolute right-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-black/10 bg-white text-[#282C3F] shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-transform duration-200",
        "hover:scale-105 hover:bg-[#fafafa] hover:shadow-[0_6px_18px_rgba(0,0,0,0.22)] active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC8019]"
      )}
      aria-label={`Add ${name} to cart`}
    >
      <ShoppingCart className="h-4 w-4 text-[#282C3F]" strokeWidth={2.25} />
    </button>
  );

  const cardInner = (
    <div
      className={cn(
        "group relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-[#1a1f2e] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)]",
        "ring-1 ring-white/10 transition-transform duration-300 ease-out",
        "hover:scale-[1.02] hover:shadow-[0_20px_50px_-18px_rgba(0,0,0,0.65)]",
        onMobileOpen && "cursor-pointer"
      )}
      role={onMobileOpen ? "button" : undefined}
      tabIndex={onMobileOpen ? 0 : undefined}
      onKeyDown={
        onMobileOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (
                  !(e.target instanceof HTMLElement) ||
                  !e.target.closest("[data-no-sheet]")
                ) {
                  onMobileOpen(product);
                }
              }
            }
          : undefined
      }
      onClick={onMobileOpen ? handleCardClick : undefined}
    >
      <img
        src={imageUrl}
        alt={name}
        className="absolute inset-0 z-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        aria-hidden
      />

      {!onMobileOpen && (
        <Link
          to={`/product/${productId}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${name}`}
        />
      )}

      {addFab}
      {glassPanel}
    </div>
  );

  const card = (
    <Motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      {cardInner}
    </Motion.div>
  );

  return (
    <>
      {card}

      <AddToCartModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{
          _id: productId,
          productId,
          name,
          price,
          image: imageUrl,
        }}
      />
    </>
  );
}
