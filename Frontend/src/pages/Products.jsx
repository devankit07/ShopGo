import { useState, useEffect } from "react";
import axios from "axios";
import ProductFilter from "@/components/products/ProductFilter";
import ProductGrid from "@/components/products/ProductGrid";

const API_BASE = "http://localhost:8000";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => {
        if (!cancelled && res.data?.product) {
          setProducts(Array.isArray(res.data.product) ? res.data.product : []);
        }
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered =
    category === "All"
      ? products
      : products.filter(
          (p) => (p.category || "").toLowerCase() === category.toLowerCase()
        );

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
          Products
        </h1>
        <div className="mb-8">
          <ProductFilter activeCategory={category} onSelect={setCategory} />
        </div>
        <ProductGrid
          products={filtered}
          loading={loading}
          emptyMessage={
            category === "All"
              ? "No products available yet."
              : `No products in ${category}.`
          }
        />
      </div>
    </main>
  );
}
