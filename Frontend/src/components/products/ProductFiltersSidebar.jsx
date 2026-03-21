import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_CONFIG, FASHION_SIZES } from "./productCategories";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

const PRICE_PRESETS = [
  { label: "Under ₹500", min: "", max: "500" },
  { label: "₹500 – ₹2,000", min: "500", max: "2000" },
  { label: "₹2,000 – ₹10,000", min: "2000", max: "10000" },
  { label: "Above ₹10,000", min: "10000", max: "" },
];

export default function ProductFiltersSidebar({
  categoryConfig = CATEGORY_CONFIG,
  isDesktopOpen,
  category,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  brand,
  onBrandChange,
  size,
  onSizeChange,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <details
      open={isDesktopOpen}
      className="rounded-2xl border border-[#e9e9eb] bg-white p-4 shadow-sm lg:rounded-xl"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 font-bold text-[#282C3F] lg:hidden [&::-webkit-details-marker]:hidden">
        <SlidersHorizontal className="h-5 w-5 text-[#fc8019]" />
        Filters & search
      </summary>

      <div className="mt-5 space-y-6 lg:mt-6">
        {/* Search */}
        <div>
          <label htmlFor="product-search" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#7E808C]">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7E808C]" />
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Name, brand, category, description…"
              className="h-10 w-full rounded-xl border border-[#e9e9eb] bg-[#f8f8f8] py-2 pl-9 pr-3 text-sm text-[#282C3F] placeholder:text-[#7E808C] focus:border-[#fc8019] focus:outline-none focus:ring-2 focus:ring-[#fc8019]/25"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#7E808C]">
            Category
          </p>
          <ul className="max-h-[220px] space-y-1 overflow-y-auto pr-1">
            {categoryConfig.map(({ id, label, icon: Icon }) => {
              const active = category === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onCategoryChange(id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                      active
                        ? "bg-[#fff5f0] font-semibold text-[#fc8019]"
                        : "text-[#282C3F] hover:bg-[#f8f8f8]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        active ? "bg-[#fc8019]/15 text-[#fc8019]" : "bg-[#f0f0f0] text-[#7E808C]"
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="product-sort" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#7E808C]">
            Sort by
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-[#e9e9eb] bg-white px-3 text-sm text-[#282C3F] focus:border-[#fc8019] focus:outline-none focus:ring-2 focus:ring-[#fc8019]/25"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#7E808C]">
            Price (₹)
          </p>
          <div className="mb-2 flex gap-2">
            <input
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="h-9 w-full min-w-0 rounded-lg border border-[#e9e9eb] px-2 text-sm text-[#282C3F] focus:border-[#fc8019] focus:outline-none focus:ring-2 focus:ring-[#fc8019]/25"
            />
            <input
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="h-9 w-full min-w-0 rounded-lg border border-[#e9e9eb] px-2 text-sm text-[#282C3F] focus:border-[#fc8019] focus:outline-none focus:ring-2 focus:ring-[#fc8019]/25"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onMinPriceChange(p.min);
                  onMaxPriceChange(p.max);
                }}
                className="rounded-full border border-[#e9e9eb] bg-[#f8f8f8] px-2.5 py-1 text-xs font-medium text-[#282C3F] transition-colors hover:border-[#fc8019]/40 hover:bg-[#fff5f0]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brand (works across categories; also covered by search) */}
        <div>
          <label htmlFor="product-brand" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#7E808C]">
            Brand (exact match)
          </label>
          <input
            id="product-brand"
            type="text"
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="e.g. Samsung, Nike"
            className="h-10 w-full rounded-xl border border-[#e9e9eb] bg-white px-3 text-sm text-[#282C3F] placeholder:text-[#7E808C] focus:border-[#fc8019] focus:outline-none focus:ring-2 focus:ring-[#fc8019]/25"
          />
        </div>

        {/* Size — only for Fashion category */}
        {category === "Fashion" && (
          <div>
            <label
              htmlFor="product-size"
              className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#7E808C]"
            >
              Size (Fashion items)
            </label>
            <select
              id="product-size"
              value={size}
              onChange={(e) => onSizeChange(e.target.value)}
              className="h-11 w-full rounded-full border-2 border-[#fc8019] bg-white px-4 text-sm text-[#282C3F] focus:border-[#ea7310] focus:outline-none focus:ring-2 focus:ring-[#fc8019]/30"
            >
              <option value="">Any size</option>
              {FASHION_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] leading-snug text-[#7E808C]">
              Only applies when products have a size saved.
            </p>
          </div>
        )}

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#e9e9eb] text-[#7E808C] hover:bg-[#fff5f0] hover:text-[#fc8019]"
            onClick={onClearFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </details>
  );
}
