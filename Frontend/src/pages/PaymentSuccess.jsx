import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const isCod = useMemo(
    () => searchParams.get("cod") === "1",
    [searchParams]
  );

  const paymentId = useMemo(
    () => searchParams.get("payment_id") || "Unavailable",
    [searchParams]
  );

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pt-24 pb-16">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-green-700">
          {isCod ? "Order placed" : "Payment successful"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isCod
            ? "Your Cash on Delivery order is confirmed. Pay when the package arrives."
            : "Your payment was completed successfully."}
        </p>
        {!isCod && (
          <div className="mt-6 rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Payment ID</p>
            <p className="mt-1 break-all font-medium text-[#282C3F]">{paymentId}</p>
          </div>
        )}
        <Button asChild className="mt-6 w-full bg-[#FC8019] hover:bg-[#ea7310]">
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
};

export default PaymentSuccess;
