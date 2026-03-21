import {
  CART_MODES,
  CART_RULES,
  MAXCART_RULES,
} from "./cartConstants";

/**
 * Amount still needed to unlock the current mode's minimum (0 if already met).
 */
export function getRemainingAmount(cartTotal, cartMode) {
  const safe = Math.max(0, Number(cartTotal) || 0);
  const min =
    cartMode === CART_MODES.MAXCART
      ? MAXCART_RULES.MIN_ORDER
      : CART_RULES.MIN_ORDER;
  return Math.max(0, min - safe);
}

/**
 * Progress toward unlock for UI (0–100).
 */
export function getUnlockProgressPercent(cartTotal, cartMode) {
  const safe = Math.max(0, Number(cartTotal) || 0);
  const min =
    cartMode === CART_MODES.MAXCART
      ? MAXCART_RULES.MIN_ORDER
      : CART_RULES.MIN_ORDER;
  if (min <= 0) return 100;
  return Math.min(100, Math.round((safe / min) * 100));
}

function capDiscount(amount, subtotal) {
  const s = Math.max(0, Number(subtotal) || 0);
  return Math.min(Math.max(0, Number(amount) || 0), s);
}

/**
 * Single discount line — coupons do not stack.
 * @param {number} cartTotal — pre-discount subtotal
 * @param {"cart"|"maxcart"} cartMode
 * @param {boolean} isFirstOrder
 * @returns {{
 *   discount: number,
 *   code: string | null,
 *   isAuto: boolean,
 *   unlocked: boolean,
 * }}
 */
export function getCartDiscount(cartTotal, cartMode, isFirstOrder) {
  const subtotal = Math.max(0, Number(cartTotal) || 0);

  if (cartMode === CART_MODES.CART) {
    if (subtotal < CART_RULES.MIN_ORDER) {
      return {
        discount: 0,
        code: null,
        isAuto: false,
        unlocked: false,
      };
    }
    if (!isFirstOrder) {
      return {
        discount: 0,
        code: null,
        isAuto: false,
        unlocked: true,
      };
    }
    return {
      discount: capDiscount(CART_RULES.FIRST_ORDER_DISCOUNT, subtotal),
      code: CART_RULES.FIRST_ORDER_COUPON_CODE,
      isAuto: true,
      unlocked: true,
    };
  }

  // MAXCART
  if (subtotal < MAXCART_RULES.MIN_ORDER) {
    return {
      discount: 0,
      code: null,
      isAuto: false,
      unlocked: false,
    };
  }
  if (isFirstOrder) {
    return {
      discount: capDiscount(MAXCART_RULES.FIRST_ORDER_DISCOUNT, subtotal),
      code: MAXCART_RULES.FIRST_ORDER_COUPON_CODE,
      isAuto: true,
      unlocked: true,
    };
  }
  return {
    discount: capDiscount(MAXCART_RULES.REPEAT_ORDER_DISCOUNT, subtotal),
    code: MAXCART_RULES.REPEAT_AUTO_CODE,
    isAuto: true,
    unlocked: true,
  };
}

export function isMaxCartTabUnlocked(cartTotal) {
  return Math.max(0, Number(cartTotal) || 0) >= MAXCART_RULES.MIN_ORDER;
}
