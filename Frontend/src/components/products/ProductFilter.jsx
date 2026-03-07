import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Cpu,
  Shirt,
  Gem,
  Home,
  Watch,
  Smartphone,
} from "lucide-react";

export const PRODUCT_CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Jewellery",
  "Home & Kitchen",
  "Accessories",
  "Gadgets",
];

const CATEGORY_CONFIG = [
  { id: "All", label: "All", icon: LayoutGrid },
  { id: "Electronics", label: "Electronics", icon: Cpu },
  { id: "Fashion", label: "Fashion", icon: Shirt },
  { id: "Jewellery", label: "Jewellery", icon: Gem },
  { id: "Home & Kitchen", label: "Home & Kitchen", icon: Home },
  { id: "Accessories", label: "Accessories", icon: Watch },
  { id: "Gadgets", label: "Gadgets", icon: Smartphone },
];

export default function ProductFilter({ activeCategory, onSelect }) {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2 -mx-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
      {CATEGORY_CONFIG.map(({ id, label, icon: Icon }) => {
        const isActive = activeCategory === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "group flex-shrink-0 flex flex-col items-center gap-1.5 rounded-xl px-4 py-3 min-w-[80px] sm:min-w-[90px] transition-all duration-200",
              isActive
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-md"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg transition-all duration-200",
                isActive
                  ? "opacity-100 bg-teal-500/30 text-teal-300"
                  : "opacity-0 group-hover:opacity-100 bg-amber-400/20 text-amber-400"
              )}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
            </span>
            <span
              className={cn(
                "text-xs sm:text-sm font-medium text-center leading-tight truncate max-w-full",
                isActive ? "font-semibold text-teal-200" : "group-hover:text-white"
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
