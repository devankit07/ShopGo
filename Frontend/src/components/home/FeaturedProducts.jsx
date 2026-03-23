import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion as Motion } from "framer-motion";

const API_BASE = "";
const DISPLAY_COUNT = 8;

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
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
    <section
      id="featured"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#1f2538_0%,#101525_36%,#0b0f1a_100%)] py-16 md:py-20"
    >
      <div className="pointer-events-none absolute -left-16 top-0 h-52 w-52 rounded-full bg-[#fc8019]/18 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-12 h-52 w-52 rounded-full bg-[#ffb780]/15 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Featured <span className="text-[#ffb780]">Products</span>
          </h2>
          <Button
            asChild
            variant="outline"
            className="w-fit rounded-xl border-[#ffb780]/35 bg-white/5 text-[#ffca9c] hover:border-[#ffb780]/70 hover:bg-[#fc8019]/10"
          >
            <Link to="/products">View All Products</Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl border border-white/10 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No products available yet.</p>
        ) : (
          <Motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => (
              <Motion.div
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35 }}
              >
                <ProductCard product={product} />
              </Motion.div>
            ))}
          </Motion.div>
        )}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#ffca9c]/80">
          <Sparkles className="h-3.5 w-3.5" />
          Our Featured Products
        </div>
      </div>
    </section>
  );
}
