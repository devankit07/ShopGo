import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import CartThresholdPromoListener from "@/components/promo/CartThresholdPromoListener";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFiltersSidebar from "@/components/products/ProductFiltersSidebar";
import MobileProductSheet from "@/components/products/MobileProductSheet";
import { mergeCategoryConfigForStorefront } from "@/components/products/productCategories";
import FeaturedServices from "@/components/home/FeaturedServices";
import Footer from "@/components/Footer";

const API_BASE = "";
const PER_PAGE_MOBILE = 6;
const PER_PAGE_DESKTOP = 9;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [mobileSheetProduct, setMobileSheetProduct] = useState(null);
  const [categoryConfig, setCategoryConfig] = useState(() =>
    mergeCategoryConfigForStorefront([])
  );

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

  const refreshCategoryConfig = useCallback(() => {
    axios
      .get(`${API_BASE}/api/products/categories`)
      .then((res) => {
        const list = Array.isArray(res.data?.categories) ? res.data.categories : [];
        setCategoryConfig(mergeCategoryConfigForStorefront(list));
      })
      .catch(() => {
        setCategoryConfig(mergeCategoryConfigForStorefront([]));
      });
  }, []);

  useEffect(() => {
    refreshCategoryConfig();
  }, [refreshCategoryConfig]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") refreshCategoryConfig();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [refreshCategoryConfig]);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch, sort, minPrice, maxPrice, brand, size]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(perPage));
    if (category && category !== "All") params.set("category", category);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (sort && sort !== "newest") params.set("sort", sort);
    const minN = minPrice === "" ? null : Number(minPrice);
    const maxN = maxPrice === "" ? null : Number(maxPrice);
    if (minN != null && !Number.isNaN(minN) && minN >= 0) params.set("minPrice", String(minN));
    if (maxN != null && !Number.isNaN(maxN) && maxN >= 0) params.set("maxPrice", String(maxN));
    if (brand.trim()) params.set("brand", brand.trim());
    if (size) params.set("size", size);

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
  }, [page, category, perPage, debouncedSearch, sort, minPrice, maxPrice, brand, size]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (isLaptop) setMobileSheetProduct(null);
  }, [isLaptop]);

  const mobileFilterParams = useMemo(
    () => ({
      category,
      debouncedSearch,
      sort,
      minPrice,
      maxPrice,
      brand,
      size,
    }),
    [category, debouncedSearch, sort, minPrice, maxPrice, brand, size]
  );

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (newCategory !== "Fashion") setSize("");
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      debouncedSearch.length > 0 ||
      sort !== "newest" ||
      minPrice !== "" ||
      maxPrice !== "" ||
      brand.trim() !== "" ||
      size !== "" ||
      category !== "All"
    );
  }, [debouncedSearch, sort, minPrice, maxPrice, brand, size, category]);

  const clearFilters = () => {
    setCategory("All");
    setSearch("");
    setDebouncedSearch(""); // sync clear so fetch does not wait for debounce
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setBrand("");
    setSize("");
    setPage(1);
  };

  const emptyMessage = useMemo(() => {
    if (debouncedSearch || brand || minPrice || maxPrice || size) {
      return "No products match your filters. Try adjusting search or filters.";
    }
    if (category === "All") return "No products available yet.";
    return `No products in ${category}.`;
  }, [debouncedSearch, brand, minPrice, maxPrice, size, category]);

  return (
    <>
      <main className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
        <CartThresholdPromoListener />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="mb-6 text-2xl font-bold text-[#282C3F] sm:mb-8 sm:text-3xl">
            Products
          </h1>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <aside className="shrink-0 lg:sticky lg:top-24 lg:w-72 lg:self-start xl:w-80">
              <h2 className="mb-3 hidden text-lg font-bold text-[#282C3F] lg:block">
                Filters
              </h2>
              <ProductFiltersSidebar
                isDesktopOpen={isLaptop}
                category={category}
                onCategoryChange={handleCategoryChange}
                search={search}
                onSearchChange={setSearch}
                sort={sort}
                onSortChange={setSort}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                brand={brand}
                onBrandChange={setBrand}
                size={size}
                onSizeChange={setSize}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </aside>

            <div className="min-w-0 flex-1">
              <p className="mb-4 text-sm text-[#7E808C]">
                {loading ? "Loading…" : `${pagination.total} product${pagination.total === 1 ? "" : "s"} found`}
              </p>
              <ProductGrid
                products={products}
                loading={loading}
                emptyMessage={emptyMessage}
                pagination={pagination}
                onPageChange={handlePageChange}
                onMobileOpen={
                  isLaptop ? undefined : (p) => setMobileSheetProduct(p)
                }
              />
            </div>
          </div>
        </div>

        {mobileSheetProduct && !isLaptop ? (
          <MobileProductSheet
            product={mobileSheetProduct}
            onClose={() => setMobileSheetProduct(null)}
            filterParams={mobileFilterParams}
          />
        ) : null}
      </main>
      <FeaturedServices />
      <Footer />
    </>
  );
}
