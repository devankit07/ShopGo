import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

export default function ProductGrid({ products, loading, emptyMessage }) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
          "animate-in fade-in duration-300"
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
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
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
        "animate-in fade-in duration-300"
      )}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-6 w-1/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="p-4 pt-0">
        <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
