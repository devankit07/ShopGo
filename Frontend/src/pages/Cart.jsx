import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectCartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { Button } from "@/components/ui/button";
import { DualCartProvider } from "@/components/cart/DualCartProvider";
import { useDualCart } from "@/components/cart/useDualCart";
import CartSavingsIntro from "@/components/cart/CartSavingsIntro";
import CartToggle from "@/components/cart/CartToggle";
import CartItems from "@/components/cart/CartItems";
import CouponSection from "@/components/cart/CouponSection";
import UnlockProgressBar from "@/components/cart/UnlockProgressBar";
import PriceSummary from "@/components/cart/PriceSummary";
import { getRemainingAmount } from "@/components/cart/cartDiscount";
const scriptFont = { fontFamily: "'Caveat', cursive" };

/** Line-art mascot peeking over a shelf (empty-state illustration). */
function EmptyCartMascot() {
  return (
    <svg
      className="mx-auto h-[130px] w-[220px] shrink-0 text-[#d1d5db]"
      viewBox="0 0 220 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <line
        x1="24"
        y1="90"
        x2="196"
        y2="90"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M110 90c-44 0-58-38-58-62 0-28 24-50 58-50s58 22 58 50c0 24-14 62-58 62z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M64 26 L56 4 L78 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M156 26 L164 4 L142 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="74"
        y="42"
        width="32"
        height="20"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="114"
        y="42"
        width="32"
        height="20"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M106 52h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartCheckoutBody({
  items,
  subtotal,
  onDecrease,
  onIncrease,
  onRemove,
}) {
  const { cartMode, appliedCoupon, discountUnlocked } = useDualCart();
  const discount = discountUnlocked ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, subtotal - discount);
  const showUnlockBar =
    subtotal > 0 && getRemainingAmount(subtotal, cartMode) > 0;

  return (
    <>
      <UnlockProgressBar cartSubtotal={subtotal} />
      <main
        className={`min-h-screen bg-[#f8f8f8] pt-24 ${
          showUnlockBar ? "pb-36 max-md:pb-40" : "pb-16"
        } md:pb-16`}
      >
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-2 text-2xl font-bold text-[#282C3F]">Cart</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            Choose Cart or MaxSaver — discounts never stack.
          </p>

          <CartSavingsIntro />
          <CartToggle cartSubtotal={subtotal} />

          <CartItems
            items={items}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            onRemove={onRemove}
          />

          <CouponSection cartSubtotal={subtotal} />
          <PriceSummary subtotal={subtotal} finalTotal={finalTotal} />

          <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/products">Continue shopping</Link>
              </Button>
              <Button asChild className="w-full bg-[#FC8019] hover:bg-[#ea7310] sm:w-auto">
                <Link to="/checkout">
                  Proceed to payment · ₹{finalTotal.toLocaleString()}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function Cart() {
  const items = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.User);
  const dispatch = useDispatch();

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accesstoken")
      : null;
  const isLoggedIn = Boolean(token);
  const userId = user?._id;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg flex-col items-center justify-center px-6 py-12 text-center">
          <p
            className="text-2xl leading-snug text-[#FC8019] sm:text-[1.65rem]"
            style={scriptFont}
          >
            Your picks from ShopGo will be listed here.
          </p>
          <div className="my-8">
            <EmptyCartMascot />
          </div>
          <p
            className="text-2xl leading-snug text-[#FC8019] sm:text-[1.65rem]"
            style={scriptFont}
          >
            Go ahead and find some awesome products near you…
          </p>
          <h1 className="mt-10 text-2xl font-bold tracking-tight text-[#282C3F] sm:text-3xl">
            Empty cart
          </h1>
          <p className="mt-2 text-base text-[#7E808C]">
            You haven&apos;t added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="mt-8 text-sm font-semibold text-[#FC8019] underline-offset-4 hover:underline"
          >
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <DualCartProvider
      cartSubtotal={subtotal}
      userId={userId}
      isLoggedIn={isLoggedIn}
    >
      <CartCheckoutBody
        items={items}
        subtotal={subtotal}
        onDecrease={(id) => dispatch(decreaseQuantity(id))}
        onIncrease={(id) => dispatch(increaseQuantity(id))}
        onRemove={(id) => dispatch(removeFromCart(id))}
      />
    </DualCartProvider>
  );
}
