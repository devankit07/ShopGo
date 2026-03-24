import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentFailed = () => {
  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pt-24 pb-16">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-red-700">Payment Failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Payment was cancelled or failed. Please try again.
        </p>
        <Button asChild className="mt-6 w-full bg-[#FC8019] hover:bg-[#ea7310]">
          <Link to="/checkout">Try Payment Again</Link>
        </Button>
      </div>
    </main>
  );
};

export default PaymentFailed;
