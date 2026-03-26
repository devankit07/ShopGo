import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRazorpayPayment } from "@/hooks/useRazorpayPayment";
import { verifyPaymentOnServer } from "@/lib/razorpay";
import { DualCartProvider } from "@/components/cart/DualCartProvider";
import { useDualCart } from "@/components/cart/useDualCart";
import PriceSummary from "@/components/cart/PriceSummary";
import { selectCartItems, removeFromCart } from "@/redux/cartSlice";
import { markFirstOrderCompleted } from "@/components/cart/firstOrderStorage";
import { Loader2, ShieldCheck, Banknote, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAccessToken } from "@/lib/authStorage";

const API_BASE = "/api/v1";

const PAYMENT_ONLINE = "online";
const PAYMENT_COD = "cod";

function CheckoutInner() {
  const items = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { startPayment, isPaying } = useRazorpayPayment();
  const { appliedCoupon, discountUnlocked, refreshFirstOrder } = useDualCart();
  const [paymentMode, setPaymentMode] = useState(PAYMENT_ONLINE);
  const [placingCod, setPlacingCod] = useState(false);

  const discount = discountUnlocked ? appliedCoupon.discount : 0;
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );
  const finalTotal = Math.max(0, subtotal - discount);

  const token =
    typeof window !== "undefined"
      ? getAccessToken()
      : null;

  const handlePay = async () => {
    if (!token) {
      toast.error("Please login to pay");
      navigate("/login");
      return;
    }
    if (items.length === 0 || finalTotal <= 0) return;

    await startPayment({
      amount: finalTotal,
      name: "ShopGo",
      description: `Order · ₹${finalTotal.toLocaleString()}`,
      afterPaymentSuccess: async (paymentResponse) => {
        const verified = await verifyPaymentOnServer(paymentResponse);
        if (!verified) {
          throw new Error("Payment verification failed. Please contact support.");
        }

        const products = items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          productImage: i.image,
          quantity: i.quantity,
          price: i.price,
        }));
        const res = await axios.post(
          `${API_BASE}/orders`,
          {
            products,
            totalAmount: finalTotal,
            paymentMethod: "Razorpay",
            paymentStatus: "Paid",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.data.success) {
          throw new Error(res.data.message || "Could not save your order.");
        }
        items.forEach((i) => dispatch(removeFromCart(i.productId)));
        const uid =
          res.data.order?.userId?._id ??
          res.data.order?.userId ??
          user?._id;
        if (uid) markFirstOrderCompleted(String(uid));
        refreshFirstOrder?.();
      },
    });
  };

  const placeCodOrder = async () => {
    if (!token) {
      toast.error("Please login to place your order");
      navigate("/login");
      return;
    }
    if (items.length === 0 || finalTotal <= 0) return;

    setPlacingCod(true);
    try {
      const products = items.map((i) => ({
        productId: i.productId,
        productName: i.name,
        productImage: i.image,
        quantity: i.quantity,
        price: i.price,
      }));
      const res = await axios.post(
        `${API_BASE}/orders`,
        {
          products,
          totalAmount: finalTotal,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Pending",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data.success) {
        throw new Error(res.data.message || "Could not place your order.");
      }
      items.forEach((i) => dispatch(removeFromCart(i.productId)));
      const uid =
        res.data.order?.userId?._id ??
        res.data.order?.userId ??
        user?._id;
      if (uid) markFirstOrderCompleted(String(uid));
      refreshFirstOrder?.();
      toast.success("Order placed — pay when it arrives.");
      navigate("/success?cod=1");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to place order");
    } finally {
      setPlacingCod(false);
    }
  };

  const primaryDisabled =
    items.length === 0 ||
    (paymentMode === PAYMENT_ONLINE && isPaying) ||
    (paymentMode === PAYMENT_COD && placingCod);

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pt-24 pb-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-[#282C3F]">Payment</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {paymentMode === PAYMENT_ONLINE
            ? "Pay online with UPI, cards, netbanking, or wallets via Razorpay."
            : "Pay with cash when your order is delivered — no online payment now."}
        </p>

        <fieldset className="mt-6 space-y-3">
          <legend className="text-sm font-semibold text-[#282C3F]">
            Choose payment method
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={cn(
                "flex cursor-pointer flex-col gap-2 rounded-2xl border-2 bg-white p-4 transition-colors",
                paymentMode === PAYMENT_ONLINE
                  ? "border-[#fc8019] shadow-[0_8px_24px_-12px_rgba(252,128,25,0.45)]"
                  : "border-[#eceef4] hover:border-[#fc8019]/40"
              )}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMode"
                  className="accent-[#fc8019]"
                  checked={paymentMode === PAYMENT_ONLINE}
                  onChange={() => setPaymentMode(PAYMENT_ONLINE)}
                />
                <CreditCard className="h-5 w-5 text-[#fc8019]" aria-hidden />
                <span className="font-semibold text-[#282C3F]">Online</span>
              </span>
              <span className="pl-7 text-xs text-muted-foreground">
                Razorpay — secure checkout
              </span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer flex-col gap-2 rounded-2xl border-2 bg-white p-4 transition-colors",
                paymentMode === PAYMENT_COD
                  ? "border-[#fc8019] shadow-[0_8px_24px_-12px_rgba(252,128,25,0.45)]"
                  : "border-[#eceef4] hover:border-[#fc8019]/40"
              )}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMode"
                  className="accent-[#fc8019]"
                  checked={paymentMode === PAYMENT_COD}
                  onChange={() => setPaymentMode(PAYMENT_COD)}
                />
                <Banknote className="h-5 w-5 text-[#fc8019]" aria-hidden />
                <span className="font-semibold text-[#282C3F]">Cash on delivery</span>
              </span>
              <span className="pl-7 text-xs text-muted-foreground">
                Pay at your door
              </span>
            </label>
          </div>
        </fieldset>

        {paymentMode === PAYMENT_ONLINE ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#eceef4] bg-white p-4 text-sm text-[#5f6475]">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[#fc8019]"
              aria-hidden
            />
            <p>
              After you tap Pay, Razorpay opens a secure window where you can
              choose your preferred payment method and complete checkout.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-[#eceef4] bg-white p-4 text-sm text-[#5f6475]">
            <p>
              We&apos;ll confirm your order and ship it. Please keep exact change
              ready if possible. You can track the order from your profile.
            </p>
          </div>
        )}

        <div className="mt-6">
          <PriceSummary subtotal={subtotal} finalTotal={finalTotal} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/cart">Back to cart</Link>
          </Button>
          {paymentMode === PAYMENT_ONLINE ? (
            <Button
              className="w-full bg-[#FC8019] hover:bg-[#ea7310] sm:w-auto sm:min-w-[200px]"
              onClick={handlePay}
              disabled={primaryDisabled}
            >
              {isPaying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isPaying ? "Opening Razorpay…" : `Pay ₹${finalTotal.toLocaleString()}`}
            </Button>
          ) : (
            <Button
              className="w-full bg-[#FC8019] hover:bg-[#ea7310] sm:w-auto sm:min-w-[200px]"
              onClick={placeCodOrder}
              disabled={primaryDisabled}
            >
              {placingCod ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {placingCod
                ? "Placing order…"
                : `Place order · ₹${finalTotal.toLocaleString()}`}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.User);
  const navigate = useNavigate();

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const token =
    typeof window !== "undefined"
      ? getAccessToken()
      : null;
  const isLoggedIn = Boolean(token);
  const userId = user?._id;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, navigate]);

  if (items.length === 0) {
    return null;
  }

  return (
    <DualCartProvider
      cartSubtotal={subtotal}
      userId={userId}
      isLoggedIn={isLoggedIn}
    >
      <CheckoutInner />
    </DualCartProvider>
  );
}
