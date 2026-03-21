import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  ChevronDown,
  Bookmark,
  Share2,
  ShoppingCart,
  Star,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/redux/cartSlice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_BASE = "";
const PLACEHOLDER = "https://placehold.co/600x600?text=Product";
const SAVED_KEY = "shopgo_saved_products";

function readSavedIds() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function isIdSaved(id) {
  const sid = String(id);
  return readSavedIds().map(String).includes(sid);
}

function toggleSavedId(id) {
  const sid = String(id);
  const prev = readSavedIds().map(String);
  const set = new Set(prev);
  if (set.has(sid)) set.delete(sid);
  else set.add(sid);
  const arr = [...set];
  localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
  return set.has(sid);
}

function buildListQuery(filterParams) {
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", "50");
  const {
    category,
    debouncedSearch,
    sort,
    minPrice,
    maxPrice,
    brand,
    size,
  } = filterParams;
  if (category && category !== "All") params.set("category", category);
  if (debouncedSearch) params.set("search", debouncedSearch);
  if (sort && sort !== "newest") params.set("sort", sort);
  const minN = minPrice === "" ? null : Number(minPrice);
  const maxN = maxPrice === "" ? null : Number(maxPrice);
  if (minN != null && !Number.isNaN(minN) && minN >= 0) params.set("minPrice", String(minN));
  if (maxN != null && !Number.isNaN(maxN) && maxN >= 0) params.set("maxPrice", String(maxN));
  if (brand?.trim()) params.set("brand", brand.trim());
  if (size) params.set("size", size);
  return params.toString();
}

function pickName(p) {
  return p.productName || p.name || "Product";
}

function pickDesc(p) {
  return p.productDesc || p.description || "";
}

function pickPrice(p) {
  return p.productPrice ?? p.price ?? 0;
}

function pickImages(p) {
  const urls = p.productImage?.map((img) => img?.url).filter(Boolean) || [];
  if (urls.length) return urls;
  if (p.imageUrl) return [p.imageUrl];
  return [PLACEHOLDER];
}

export default function MobileProductSheet({ product, onClose, filterParams }) {
  const dispatch = useDispatch();
  const [display, setDisplay] = useState(product);
  const [carousel, setCarousel] = useState([]);
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(() => isIdSaved(product._id));
  const thumbRefs = useRef({});
  const carouselScrollerRef = useRef(null);

  const images = useMemo(() => pickImages(display), [display]);
  const name = pickName(display);
  const desc = pickDesc(display);
  const price = pickPrice(display);
  const rating = display.rating ?? 4.2;
  const categoryLabel = display.category || "—";

  useEffect(() => {
    setDisplay(product);
    setImgIdx(0);
    setQty(1);
    setSaved(isIdSaved(product._id));
  }, [product._id]);

  const filterKey = useMemo(
    () => JSON.stringify(filterParams),
    [filterParams]
  );

  useEffect(() => {
    let cancelled = false;
    setLoadingCarousel(true);
    const q = buildListQuery(filterParams);
    axios
      .get(`${API_BASE}/api/products?${q}`)
      .then((res) => {
        const list = Array.isArray(res.data?.product) ? res.data.product : [];
        if (!cancelled) setCarousel(list);
      })
      .catch(() => {
        if (!cancelled) setCarousel([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCarousel(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filterKey]);

  const carouselRow = useMemo(() => {
    if (!carousel.length) return [display];
    const byId = new Map(carousel.map((p) => [String(p._id), p]));
    if (!byId.has(String(display._id))) return [display, ...carousel];
    return carousel;
  }, [carousel, display]);

  /* Keep active thumb centered under “More in this list” (scrollport center). */
  useEffect(() => {
    if (loadingCarousel && carousel.length === 0) return;
    const sc = carouselScrollerRef.current;
    const el = thumbRefs.current[String(display._id)];
    if (!sc || !el) return;

    const centerActive = () => {
      const scW = sc.clientWidth;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const target = elCenter - scW / 2;
      const maxScroll = Math.max(0, sc.scrollWidth - scW);
      sc.scrollTo({
        left: Math.min(maxScroll, Math.max(0, target)),
        behavior: "smooth",
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(centerActive));
  }, [display._id, loadingCarousel, carousel.length, carouselRow.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSave = () => {
    const next = toggleSavedId(display._id);
    setSaved(next);
    toast.success(next ? "Saved to your list" : "Removed from saved");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${display._id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: desc.slice(0, 120), url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch (e) {
      if (e?.name !== "AbortError") toast.error("Could not share");
    }
  };

  const handleAdd = () => {
    const img = images[0] || PLACEHOLDER;
    dispatch(
      addToCart({
        productId: display._id,
        name,
        price,
        image: img,
        quantity: qty,
      })
    );
    toast.success("Added to cart");
  };

  const selectThumb = useCallback((p) => {
    setDisplay(p);
    setImgIdx(0);
    setQty(1);
    setSaved(isIdSaved(p._id));
  }, []);

  const node = (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/45 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-product-title"
    >
      <button
        type="button"
        className="min-h-[8vh] flex-1 cursor-default"
        aria-label="Close overlay"
        onClick={onClose}
      />

      <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl">
        {/* Toolbar */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#e9e9eb] px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-[#282C3F]"
            onClick={onClose}
            aria-label="Close"
          >
            <ChevronDown className="size-6" />
          </Button>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full text-[#282C3F]"
              onClick={handleSave}
              aria-label={saved ? "Remove from saved" : "Save product"}
            >
              <Bookmark
                className={cn("size-5", saved && "fill-[#fc8019] text-[#fc8019]")}
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full text-[#282C3F]"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 className="size-5" />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="relative aspect-[4/3] w-full bg-[#f8f8f8]">
            <img
              src={images[imgIdx] || PLACEHOLDER}
              alt={name}
              className="h-full w-full object-contain"
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === imgIdx ? "w-5 bg-[#fc8019]" : "w-1.5 bg-[#d1d5db]"
                    )}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="px-4 pb-4 pt-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-[#282C3F]">{rating}</span>
                <span className="text-xs text-[#7E808C]">(reviews)</span>
              </div>
            </div>

            <h2
              id="mobile-product-title"
              className="text-lg font-bold leading-snug text-[#282C3F]"
            >
              {name}
            </h2>
            {desc ? (
              <p className="mt-1 text-sm leading-relaxed text-[#7E808C] line-clamp-3">
                {desc}
              </p>
            ) : null}

            <p className="mt-2 text-xs text-[#7E808C]">
              Category: <span className="font-medium text-[#282C3F]">{categoryLabel}</span>
              {display.size ? (
                <>
                  {" "}
                  · Size: <span className="font-medium text-[#282C3F]">{display.size}</span>
                </>
              ) : null}
            </p>

            <p className="mt-3 text-2xl font-bold text-[#fc8019]">
              ₹{Number(price).toLocaleString()}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-[#e9e9eb] bg-[#f8f8f8] p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                  {qty}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <Button
              type="button"
              className="mt-4 h-12 w-full rounded-xl bg-[#fc8019] text-base font-bold text-white shadow-md shadow-[#fc8019]/25 hover:bg-[#ea7310]"
              onClick={handleAdd}
            >
              <ShoppingCart className="mr-2 size-5" />
              ADD TO CART
            </Button>

            <div className="mt-4 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 rounded-xl border-[#e9e9eb] text-[#7E808C]"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 rounded-xl border-[#fc8019] text-[#fc8019] hover:bg-[#fff5f0]"
                onClick={handleSave}
              >
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Circular carousel — active thumb scrolls to horizontal center under title */}
        <div className="shrink-0 border-t border-[#e9e9eb] bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[#7E808C]">
            More in this list
          </p>
          <div
            ref={carouselScrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth py-2 pl-[calc(50%-31px)] pr-[calc(50%-31px)] scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loadingCarousel && carousel.length === 0 ? (
              <div className="flex w-full justify-center py-4 text-sm text-[#7E808C]">
                Loading…
              </div>
            ) : (
              carouselRow.map((p) => {
                const active = String(p._id) === String(display._id);
                const thumb =
                  p.productImage?.[0]?.url || p.imageUrl || PLACEHOLDER;
                return (
                  <button
                    key={p._id}
                    type="button"
                    ref={(el) => {
                      thumbRefs.current[String(p._id)] = el;
                    }}
                    onClick={() => selectThumb(p)}
                    className={cn(
                      "relative shrink-0 snap-center rounded-full transition-all duration-200",
                      active
                        ? "z-10 -translate-y-1.5 scale-110 shadow-lg ring-4 ring-white ring-offset-2 ring-offset-[#fc8019]"
                        : "scale-90 opacity-75 hover:opacity-100"
                    )}
                    aria-current={active ? "true" : undefined}
                    aria-label={pickName(p)}
                  >
                    <span className="block size-[56px] overflow-hidden rounded-full bg-[#f0f0f0] sm:size-[62px]">
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(node, document.body);
}
