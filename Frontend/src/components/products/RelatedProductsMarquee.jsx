import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "";
const PLACEHOLDER = "https://placehold.co/200x200?text=Product";

function productImage(p) {
  return p.productImage?.[0]?.url || p.imageUrl || PLACEHOLDER;
}

function productName(p) {
  return p.productName || p.name || "Product";
}

export default function RelatedProductsMarquee({ excludeProductId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
        className="mt-14 border-t border-[#e9e9eb] bg-white py-8"
        aria-label="More products"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-lg font-bold text-[#282C3F] sm:text-xl">
            More products
          </h2>
          <div className="mt-4 h-44 max-w-6xl animate-pulse rounded-xl bg-[#f0f0f0]" />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <section
      className="mt-14 border-t border-[#e9e9eb] bg-white py-8 pb-10"
      aria-label="More products"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-lg font-bold text-[#282C3F] sm:text-xl">
          More products you may like
        </h2>
        <p className="mt-1 text-sm text-[#7E808C]">
          Scrolls automatically — hover to pause and open a product
        </p>
      </div>

      <div className="product-detail-carousel-wrap relative mt-5 overflow-hidden">
        <div className="product-detail-carousel-row gap-4 px-4 sm:gap-5 sm:px-6">
          {loop.map((p, i) => (
            <Link
              key={`${p._id}-${i}`}
              to={`/product/${p._id}`}
              className="flex w-[148px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#e9e9eb] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#fc8019]/45 hover:shadow-md sm:w-[168px]"
            >
              <div className="aspect-square w-full overflow-hidden bg-[#f8f8f8]">
                <img
                  src={productImage(p)}
                  alt={productName(p)}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="line-clamp-2 min-h-[2.5rem] px-2 py-2 text-center text-xs font-semibold leading-tight text-[#282C3F] sm:min-h-[2.75rem] sm:text-sm">
                {productName(p)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
