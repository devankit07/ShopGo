import { Button } from "@/components/ui/button";
import { useRazorpayPayment } from "@/hooks/useRazorpayPayment";
import { Loader2 } from "lucide-react";

const MOCK_CART_TOTAL = 999;

const Checkout = () => {
  const { startPayment, isPaying } = useRazorpayPayment();

  const handlePayNow = async () => {
    await startPayment({
      amount: MOCK_CART_TOTAL,
      name: "ShopGo",
      description: "Mock cart checkout payment",
    });
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pt-24 pb-16">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-[#282C3F]">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Test mode payment flow powered by Razorpay.
        </p>

        <div className="mt-6 rounded-xl border border-dashed p-4">
          <p className="text-sm text-muted-foreground">Mock Cart Total</p>
          <p className="mt-1 text-3xl font-semibold text-[#282C3F]">
            Rs. {MOCK_CART_TOTAL}
          </p>
        </div>

        <Button
          className="mt-6 w-full bg-[#FC8019] hover:bg-[#ea7310]"
          onClick={handlePayNow}
          disabled={isPaying}
        >
          {isPaying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isPaying ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </main>
  );
};

export default Checkout;
