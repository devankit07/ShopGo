import { CART_MODES } from "./cartConstants";
import { useDualCart } from "./useDualCart";

export default function PriceSummary({ subtotal, finalTotal }) {
  const { cartMode, appliedCoupon, discountUnlocked } = useDualCart();
  const discount = discountUnlocked ? appliedCoupon.discount : 0;

  return (
    <div className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Price summary
      </h2>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">₹{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Discount</span>
        <span
          className={
            discount > 0
              ? cartMode === CART_MODES.MAXCART
                ? "font-semibold text-violet-600"
                : "font-semibold text-[#ea7310]"
              : "text-muted-foreground"
          }
        >
          {discount > 0 ? `-₹${discount.toLocaleString()}` : "₹0"}
        </span>
      </div>
      <div className="border-t border-border pt-3 flex justify-between text-base font-bold">
        <span>Final total</span>
        <span>₹{finalTotal.toLocaleString()}</span>
      </div>
    </div>
  );
}
