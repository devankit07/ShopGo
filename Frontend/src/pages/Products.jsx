import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductFilter from "@/components/products/ProductFilter";
import ProductGrid from "@/components/products/ProductGrid";

const API_BASE = "";
const PER_PAGE_MOBILE = 6;
const PER_PAGE_DESKTOP = 9;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [isLaptop, setIsLaptop] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : true
  );
  const perPage = isLaptop ? PER_PAGE_DESKTOP : PER_PAGE_MOBILE;
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: perPage,
  });

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handle = () => setIsLaptop(mql.matches);
    mql.addEventListener("change", handle);
    return () => mql.removeEventListener("change", handle);
  }, []);

  // Reset to page 1 when switching mobile/laptop so pagination stays valid
  useEffect(() => {
    setPage(1);
  }, [perPage]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(perPage));
    if (category && category !== "All") params.set("category", category);

    axios
      .get(`${API_BASE}/api/products?${params.toString()}`)
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data?.product) ? data.product : [];
        setProducts(list);
        if (data?.pagination) {
          setPagination({
            page: data.pagination.page,
            totalPages: data.pagination.totalPages ?? 1,
            total: data.pagination.total ?? 0,
            limit: data.pagination.limit ?? perPage,
          });
        }
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, category, perPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when category changes
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="dark min-h-screen bg-[#262a30] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-white sm:text-3xl">
          Products
        </h1>
        <div className="mb-8">
          <ProductFilter
            activeCategory={category}
            onSelect={handleCategoryChange}
          />
        </div>
        <ProductGrid
          products={products}
          loading={loading}
          emptyMessage={
            category === "All"
              ? "No products available yet."
              : `No products in ${category}.`
          }
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
