import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductGrid({
  products,
  loading,
  emptyMessage,
  pagination,
  onPageChange,
}) {
  const { page, totalPages } = pagination || { page: 1, totalPages: 1 };

  if (loading) {
    return (
      <>
        <div
          className={cn(
            "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4",
            "animate-in fade-in duration-300"
          )}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground">
          {emptyMessage || "No products in this category."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4",
          "animate-in fade-in duration-300"
        )}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      <div className="aspect-[3/2] animate-pulse bg-muted" />
      <div className="flex flex-col gap-0.5 p-2 pt-1.5">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="p-2 pt-1">
        <div className="h-7 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function PaginationBar({ page, totalPages, onPageChange }) {
  const pages = [];
  const showMax = 5;
  let start = Math.max(1, page - Math.floor(showMax / 2));
  let end = Math.min(totalPages, start + showMax - 1);
  if (end - start + 1 < showMax) start = Math.max(1, end - showMax + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </Button>
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="sm"
            className={cn(
              "min-w-[2.25rem] rounded-lg",
              p === page && "bg-[#FF3F6C] text-white hover:bg-[#e0355f]"
            )}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
