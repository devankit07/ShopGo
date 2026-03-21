import { cn } from "@/lib/utils";
import { CART_MODES, LABELS } from "./cartConstants";
import {
  getRemainingAmount,
  getUnlockProgressPercent,
} from "./cartDiscount";
import { useDualCart } from "./useDualCart";

export default function UnlockProgressBar({ cartSubtotal }) {
  const { cartMode, isLoggedIn } = useDualCart();
  const remaining = getRemainingAmount(cartSubtotal, cartMode);
  if (remaining <= 0) return null;

  const pct = getUnlockProgressPercent(cartSubtotal, cartMode);
  const isMax = cartMode === CART_MODES.MAXCART;

  const label =
    cartMode === CART_MODES.CART
      ? `Add ₹${remaining.toLocaleString()} more to unlock ${LABELS.CART_UNLOCK}`
      : `Add ₹${remaining.toLocaleString()} more to unlock ${LABELS.MAX_SHORT}`;

  const sub =
    !isLoggedIn && cartMode === CART_MODES.CART
      ? "Log in at checkout to apply first-order benefits."
      : !isLoggedIn && isMax
        ? "Log in at checkout to apply MaxSaver benefits."
        : null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-30 border-t bg-background/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md max-md:bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:bottom-auto md:top-[4.5rem] md:z-40 md:border-b md:border-t-0 md:shadow-md",
        isMax ? "border-violet-200/80" : "border-orange-200/80"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-sm font-semibold text-foreground">
          {label}
        </p>
        {sub ? (
          <p className="mt-0.5 text-center text-xs text-muted-foreground">
            {sub}
          </p>
        ) : null}
        <div
          className={cn(
            "mt-2 h-2 overflow-hidden rounded-full bg-muted",
            isMax ? "ring-1 ring-violet-200" : "ring-1 ring-orange-200"
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
              isMax ? "bg-violet-500" : "bg-[#FC8019]"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
