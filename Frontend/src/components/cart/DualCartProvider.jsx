import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DualCartContext } from "./dualCartContext";
import { CART_MODES, STORAGE_KEYS } from "./cartConstants";
import { readIsFirstOrder } from "./firstOrderStorage";
import { getCartDiscount, isMaxCartTabUnlocked } from "./cartDiscount";

export function DualCartProvider({
  children,
  cartSubtotal,
  userId,
  isLoggedIn,
}) {
  const [cartMode, setCartModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART_MODE);
      if (saved === CART_MODES.MAXCART || saved === CART_MODES.CART) return saved;
    } catch {
      /* ignore */
    }
    return CART_MODES.CART;
  });

  const [firstOrderEpoch, bumpFirstOrderRead] = useState(0);

  const isFirstOrder = useMemo(() => {
    void firstOrderEpoch;
    return readIsFirstOrder(userId);
  }, [userId, firstOrderEpoch]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART_MODE, cartMode);
    } catch {
      /* ignore */
    }
  }, [cartMode]);

  const maxTabUnlocked = isMaxCartTabUnlocked(cartSubtotal);

  useEffect(() => {
    if (cartMode === CART_MODES.MAXCART && !maxTabUnlocked) {
      const id = window.requestAnimationFrame(() =>
        setCartModeState(CART_MODES.CART)
      );
      return () => window.cancelAnimationFrame(id);
    }
  }, [cartMode, maxTabUnlocked]);

  const setCartMode = useCallback(
    (mode) => {
      if (mode === CART_MODES.MAXCART && !isMaxCartTabUnlocked(cartSubtotal)) {
        return false;
      }
      setCartModeState(mode);
      return true;
    },
    [cartSubtotal]
  );

  const applied = useMemo(
    () => getCartDiscount(cartSubtotal, cartMode, isFirstOrder),
    [cartSubtotal, cartMode, isFirstOrder]
  );

  const refreshFirstOrder = useCallback(() => {
    bumpFirstOrderRead((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({
      cartMode,
      setCartMode,
      maxTabUnlocked,
      isFirstOrder,
      isLoggedIn,
      appliedCoupon: {
        code: applied.code,
        discount: applied.discount,
        isAuto: applied.isAuto,
      },
      discountUnlocked: applied.unlocked,
      refreshFirstOrder,
    }),
    [
      cartMode,
      setCartMode,
      maxTabUnlocked,
      isFirstOrder,
      isLoggedIn,
      applied.code,
      applied.discount,
      applied.isAuto,
      applied.unlocked,
      refreshFirstOrder,
    ]
  );

  return (
    <DualCartContext.Provider value={value}>{children}</DualCartContext.Provider>
  );
}
