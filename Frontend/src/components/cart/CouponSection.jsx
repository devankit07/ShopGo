import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Tag } from "lucide-react";
import {
  CART_MODES,
  CART_RULES,
  MAXCART_RULES,
} from "./cartConstants";
import { getRemainingAmount } from "./cartDiscount";
import { useDualCart } from "./useDualCart";

export default function CouponSection({ cartSubtotal }) {
  const { cartMode, discountUnlocked, appliedCoupon, isFirstOrder } =
    useDualCart();
  const [celebrate, setCelebrate] = useState(false);
  const prev = useRef({
    remaining: getRemainingAmount(cartSubtotal, cartMode),
    mode: cartMode,
  });

  useEffect(() => {
    const remaining = getRemainingAmount(cartSubtotal, cartMode);
    const was = prev.current;
    const unlocked =
      was.mode === cartMode &&
      was.remaining > 0 &&
      remaining === 0 &&
      cartSubtotal > 0;

    if (unlocked) {
      let hideId;
      const startId = window.setTimeout(() => {
        setCelebrate(true);
        hideId = window.setTimeout(() => setCelebrate(false), 2200);
      }, 0);
      prev.current = { remaining, mode: cartMode };
      return () => {
        window.clearTimeout(startId);
        if (hideId) window.clearTimeout(hideId);
      };
    }
    prev.current = { remaining, mode: cartMode };
  }, [cartSubtotal, cartMode]);

  if (cartSubtotal <= 0) return null;

  if (!discountUnlocked) return null;

  if (cartMode === CART_MODES.CART && appliedCoupon.discount <= 0) {
    return null;
  }

  let title;
  let subtitle;

  if (cartMode === CART_MODES.CART) {
    title = `₹${CART_RULES.FIRST_ORDER_DISCOUNT.toLocaleString()} OFF with ${CART_RULES.FIRST_ORDER_COUPON_CODE}`;
    subtitle = appliedCoupon.isAuto
      ? "Applied automatically — first order only."
      : "First order only.";
  } else if (isFirstOrder) {
    title = `₹${MAXCART_RULES.FIRST_ORDER_DISCOUNT.toLocaleString()} OFF applied`;
    subtitle = `Code ${MAXCART_RULES.FIRST_ORDER_COUPON_CODE} — MaxSaver first order.`;
  } else {
    title = `₹${MAXCART_RULES.REPEAT_ORDER_DISCOUNT.toLocaleString()} OFF applied`;
    subtitle = "MaxSaver savings on every order.";
  }

  return (
    <div
      className={cn(
        "mt-6 rounded-2xl border p-4 shadow-sm transition-shadow duration-500",
        cartMode === CART_MODES.MAXCART
          ? "border-violet-200 bg-violet-50/80 dark:bg-violet-950/30"
          : "border-orange-200 bg-orange-50/80 dark:bg-orange-950/20",
        celebrate &&
          (cartMode === CART_MODES.MAXCART
            ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-background animate-in fade-in zoom-in-95 duration-300"
            : "ring-2 ring-[#FC8019] ring-offset-2 ring-offset-background animate-in fade-in zoom-in-95 duration-300")
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            cartMode === CART_MODES.MAXCART
              ? "bg-violet-600 text-white"
              : "bg-[#FC8019] text-white"
          )}
        >
          {celebrate ? (
            <Sparkles className="size-5" aria-hidden />
          ) : (
            <Tag className="size-5" aria-hidden />
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
