import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CART_MODES, LABELS, MAXCART_RULES } from "./cartConstants";
import { getRemainingAmount } from "./cartDiscount";
import { useDualCart } from "./useDualCart";

export default function CartToggle({ cartSubtotal }) {
  const { cartMode, setCartMode, maxTabUnlocked } = useDualCart();
  const needMax = getRemainingAmount(cartSubtotal, CART_MODES.MAXCART);

  const tryMax = () => {
    if (!setCartMode(CART_MODES.MAXCART)) {
      toast.message(`Add ₹${needMax.toLocaleString()} more to unlock ${LABELS.MAX_SHORT}`);
    }
  };

  return (
    <div
      className="mb-6 flex rounded-2xl border border-border bg-card p-1 shadow-sm"
      role="tablist"
      aria-label="Cart mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={cartMode === CART_MODES.CART}
        className={cn(
          "relative flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-300",
          cartMode === CART_MODES.CART
            ? "bg-[#FC8019] text-white shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setCartMode(CART_MODES.CART)}
      >
        {LABELS.CART_TAB}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={cartMode === CART_MODES.MAXCART}
        disabled={!maxTabUnlocked}
        className={cn(
          "relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition-all duration-300",
          cartMode === CART_MODES.MAXCART
            ? "bg-violet-600 text-white shadow-md"
            : "text-muted-foreground hover:text-foreground",
          !maxTabUnlocked && "cursor-not-allowed opacity-80"
        )}
        onClick={tryMax}
        title={
          maxTabUnlocked
            ? LABELS.MAX_TAB
            : `Unlock at ₹${MAXCART_RULES.MIN_ORDER.toLocaleString()}`
        }
      >
        {!maxTabUnlocked ? (
          <Lock className="size-3.5 shrink-0" aria-hidden />
        ) : null}
        {LABELS.MAX_TAB}
      </button>
    </div>
  );
}
