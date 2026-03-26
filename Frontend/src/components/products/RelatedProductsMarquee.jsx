import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import AddToCartModal from "@/components/products/AddToCartModal";
import { cn } from "@/lib/utils";

const API_BASE = "";
const PLACEHOLDER = "https://placehold.co/200x200?text=Product";

function productImage(p) {
  return p.productImage?.[0]?.url || p.imageUrl || PLACEHOLDER;
}

function productName(p) {
  return p.productName || p.name || "Product";
}

function productPrice(p) {
  return p.productPrice ?? p.price ?? 0;
}

export default function RelatedProductsMarquee({ excludeProductId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartModalProduct, setCartModalProduct] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/products?limit=48`)
      .then((res) => {
        const list = Array.isArray(res.data?.product) ? res.data.product : [];
        const filtered = list.filter(
          (p) => String(p._id) !== String(excludeProductId)
        );
        if (!cancelled) setItems(filtered);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [excludeProductId]);

  if (loading) {
    return (
      <section
        className="mt-14 border-t border-[#e9e9eb] bg-[#f8f8f8] py-8"
        aria-label="More products"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-xl font-bold text-[#282C3F] sm:text-2xl">
            More products you may like
          </h2>
          <p className="mt-1 text-sm text-[#7E808C]">
            Scrolls automatically — hover to pause and open a product.
          </p>
          <div className="mt-5 flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-[260px] w-[158px] shrink-0 animate-pulse rounded-xl border border-[#eceef4] bg-white shadow-md sm:w-[172px]"
              >
                <div className="aspect-[4/5] w-full rounded-t-xl bg-[#eceef4]" />
                <div className="mx-auto mt-3 h-3 w-3/4 rounded bg-[#eceef4]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <section
      className="mt-14 border-t border-[#e9e9eb] bg-[#f8f8f8] py-8 pb-10"
      aria-label="More products you may like"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-xl font-bold text-[#282C3F] sm:text-2xl">
          More products you may like
        </h2>
        <p className="mt-1 text-sm text-[#7E808C]">
          Scrolls automatically — hover to pause and open a product.
        </p>
      </div>

      <div className="product-detail-carousel-wrap relative mt-5 overflow-hidden">
        <div className="product-detail-carousel-row gap-4 px-4 sm:gap-5 sm:px-6">
          {loop.map((p, i) => (
            <div
              key={`${p._id}-${i}`}
              className="group relative w-[158px] shrink-0 sm:w-[172px]"
            >
              <Link
                to={`/product/${p._id}`}
                className={cn(
                  "flex h-[260px] flex-col overflow-hidden rounded-xl border border-[#e5e5e5] bg-white",
                  "shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-[#fc8019]/55 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                )}
              >
                <div className="relative min-h-0 flex-[4] overflow-hidden rounded-t-xl bg-white">
                  <img
                    src={productImage(p)}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="flex min-h-[3.25rem] flex-[1] items-center justify-center border-t border-[#f0f0f0] bg-white px-2 py-2">
                  <p className="line-clamp-2 text-center text-xs font-bold leading-tight text-[#282C3F] sm:text-[13px]">
                    {productName(p)}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                aria-label={`Add ${productName(p)} to cart`}
                className={cn(
                  "absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full",
                  "border border-black/10 bg-white text-[#282C3F] shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
                  "transition hover:bg-[#fafafa] hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC8019]"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCartModalProduct(p);
                }}
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddToCartModal
        open={Boolean(cartModalProduct)}
        onClose={() => setCartModalProduct(null)}
        product={
          cartModalProduct
            ? {
                _id: cartModalProduct._id,
                productId: cartModalProduct._id,
                name: productName(cartModalProduct),
                price: productPrice(cartModalProduct),
                image: productImage(cartModalProduct),
              }
            : null
        }
      />
    </section>
  );
}
