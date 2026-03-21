/** Dual-cart (Cart / MaxSaver) business rules — single source of truth */

export const CART_MODES = {
  CART: "cart",
  MAXCART: "maxcart",
};

export const CART_RULES = {
  MIN_ORDER: 299,
  FIRST_ORDER_COUPON_CODE: "FIRSTCART",
  FIRST_ORDER_DISCOUNT: 50,
};

export const MAXCART_RULES = {
  MIN_ORDER: 699,
  FIRST_ORDER_COUPON_CODE: "FIRSTMAX",
  FIRST_ORDER_DISCOUNT: 69,
  REPEAT_ORDER_DISCOUNT: 29,
  REPEAT_AUTO_CODE: "MAXSAVER_AUTO",
};

export const STORAGE_KEYS = {
  CART_MODE: "shopgo_cart_mode",
  /** Per-user: "true" means user has completed at least one order */
  HAS_COMPLETED_ORDER: (userId) =>
    userId ? `shopgo_has_completed_order_${userId}` : "shopgo_has_completed_order_guest",
};

export const LABELS = {
  CART_TAB: "Cart",
  MAX_TAB: "MaxSaver Cart",
  MAX_SHORT: "MaxSaver",
  CART_UNLOCK: "Cart discount",
};
