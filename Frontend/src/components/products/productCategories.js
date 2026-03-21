import {
  LayoutGrid,
  Cpu,
  Shirt,
  Gem,
  Home,
  Watch,
  Smartphone,
  Package,
} from "lucide-react";

export const CATEGORY_CONFIG = [
  { id: "All", label: "All categories", icon: LayoutGrid },
  { id: "Electronics", label: "Electronics", icon: Cpu },
  { id: "Fashion", label: "Fashion", icon: Shirt },
  { id: "Jewellery", label: "Jewellery", icon: Gem },
  { id: "Home & Kitchen", label: "Home & Kitchen", icon: Home },
  { id: "Accessories", label: "Accessories", icon: Watch },
  { id: "Gadgets", label: "Gadgets", icon: Smartphone },
];

export const PRODUCT_CATEGORIES = CATEGORY_CONFIG.map((c) => c.id);

/** Sizes for Fashion (and optional filter when browsing all). */
export const FASHION_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free size"];

const DEFAULT_IDS = new Set(CATEGORY_CONFIG.map((c) => c.id));

/**
 * Merges DB-backed category names into the sidebar: defaults first, then extras with Package icon.
 */
export function mergeCategoryConfigForStorefront(apiCategoryNames = []) {
  const extras = [...new Set(apiCategoryNames.map((c) => String(c).trim()).filter(Boolean))]
    .filter((id) => !DEFAULT_IDS.has(id))
    .sort((a, b) => a.localeCompare(b));
  const extraRows = extras.map((id) => ({ id, label: id, icon: Package }));
  return [...CATEGORY_CONFIG, ...extraRows];
}
