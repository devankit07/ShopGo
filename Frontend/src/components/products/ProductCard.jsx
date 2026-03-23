import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import AddToCartModal from "./AddToCartModal";
import { motion as Motion } from "framer-motion";

const PLACEHOLDER_IMG = "https://placehold.co/400x300?text=Product";

export default function ProductCard({ product, onMobileOpen }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const name = product.productName || product.name;
  const description = product.productDesc || product.description || "";
  const price = product.productPrice ?? product.price;
  const imageUrl =
    product.productImage?.[0]?.url || product.imageUrl || PLACEHOLDER_IMG;
  const productId = product._id;

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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (0.5 - py) * 6,
      y: (px - 0.5) * 6,
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const card = (
    <Motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="h-full"
    >
      <Card
      role={onMobileOpen ? "button" : undefined}
      tabIndex={onMobileOpen ? 0 : undefined}
      onKeyDown={
        onMobileOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!(e.target instanceof HTMLElement) || !e.target.closest("[data-no-sheet]")) {
                  onMobileOpen(product);
                }
              }
            }
          : undefined
      }
      className={cn(
        "group relative h-full overflow-hidden rounded-[1.6rem] border border-[#eceef4] bg-white shadow-[0_10px_26px_-18px_rgba(17,24,39,0.35)]",
        "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#fc8019]/35 hover:shadow-[0_26px_40px_-22px_rgba(17,24,39,0.42)]",
        onMobileOpen && "cursor-pointer"
      )}
      style={{
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      onClick={onMobileOpen ? handleCardClick : undefined}
    >
      <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(252,128,25,0.25),transparent_58%)]" />
      </div>
      <div className="relative aspect-[13/7] overflow-hidden rounded-b-[1.1rem] bg-[#f7f7f8] sm:aspect-[16/10]">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-contain object-center transition-transform duration-500 ease-out"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_42%,rgba(255,255,255,0.36)_55%,transparent_68%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-3 bottom-3 z-20 flex translate-y-2 items-center justify-end gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#2a3043] backdrop-blur">
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </span>
          <button
            type="button"
            data-no-sheet
            onClick={handleAddToCartClick}
            className="inline-flex items-center gap-1 rounded-full border border-[#fc8019]/25 bg-[#fff4eb] px-3 py-1 text-[11px] font-semibold text-[#fc8019]"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
      <CardContent className="flex flex-col px-3 pb-1 pt-2">
        <h3 className="line-clamp-1 text-[0.95rem] font-semibold leading-tight text-[#2a3043] sm:text-base">
          {name}
        </h3>
        <p className="line-clamp-1 pt-0.5 text-[11px] leading-tight text-[#7a7e8f] sm:text-xs">
          {description}
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-[1.35rem] font-extrabold leading-tight text-[#fc8019] sm:text-lg">
            ₹{Number(price).toLocaleString()}
          </p>
          <span className="hidden rounded-full border border-[#ffe3cd] bg-[#fff6ee] px-2 py-0.5 text-[10px] font-semibold text-[#fc8019] sm:inline-flex">
            Best Deal
          </span>
        </div>
      </CardContent>
      <CardFooter
        className="p-2.5 pt-1"
        data-no-sheet
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          data-no-sheet
          size="sm"
          onClick={handleAddToCartClick}
          className="h-8 w-full rounded-xl bg-[#FC8019] text-[11px] font-semibold text-white shadow-[0_12px_24px_-14px_rgba(252,128,25,0.85)] hover:bg-[#ea7310] sm:h-9 sm:text-xs"
        >
          <ShoppingCart className="mr-1.5 size-3.5" />
          Add To Cart
        </Button>
      </CardFooter>
      </Card>
    </Motion.div>
  );

  return (
    <>
      {onMobileOpen ? (
        <div className="block">{card}</div>
      ) : (
        <Link to={`/product/${productId}`} className="block">
          {card}
        </Link>
      )}

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
