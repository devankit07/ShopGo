import { useEffect, useMemo } from "react";
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
import { Loader2, ShieldCheck } from "lucide-react";

const API_BASE = "/api/v1";

function CheckoutInner() {
  const items = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { startPayment, isPaying } = useRazorpayPayment();
  const { appliedCoupon, discountUnlocked, refreshFirstOrder } = useDualCart();

  const discount = discountUnlocked ? appliedCoupon.discount : 0;
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );
  const finalTotal = Math.max(0, subtotal - discount);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accesstoken")
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

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pt-24 pb-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-[#282C3F]">Payment</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pay securely with UPI, cards, netbanking, or wallets via Razorpay.
        </p>

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

        <div className="mt-6">
          <PriceSummary subtotal={subtotal} finalTotal={finalTotal} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/cart">Back to cart</Link>
          </Button>
          <Button
            className="w-full bg-[#FC8019] hover:bg-[#ea7310] sm:w-auto sm:min-w-[200px]"
            onClick={handlePay}
            disabled={isPaying || items.length === 0}
          >
            {isPaying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isPaying ? "Opening Razorpay…" : `Pay ₹${finalTotal.toLocaleString()}`}
          </Button>
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
      ? localStorage.getItem("accesstoken")
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
