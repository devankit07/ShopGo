import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Electric",
  "Jewellery",
  "Electronics",
  "Accessories",
];

export default function ProductFilter({ activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-all",
            activeCategory === cat
              ? "bg-[#FF3F6C] text-white shadow-md"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
