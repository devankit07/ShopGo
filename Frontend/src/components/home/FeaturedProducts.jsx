import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

const API_BASE = "";
const DISPLAY_COUNT = 8;

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => {
        if (!cancelled && res.data?.product) {
          const list = Array.isArray(res.data.product) ? res.data.product : [];
          setProducts(list.slice(0, DISPLAY_COUNT));
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

  return (
    <section id="featured" className="py-16 md:py-20 bg-[#0f1419]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Featured <span className="text-teal-400">Products</span>
          </h2>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400 w-fit"
          >
            <Link to="/products">View All Products</Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#161d26] border border-white/10 h-80 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
