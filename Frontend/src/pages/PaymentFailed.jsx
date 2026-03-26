import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getFailureExplanation } from "@/lib/paymentFailure";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();

  const { title, body, hint } = useMemo(() => {
    const reason = searchParams.get("reason") || "unknown";
    const detail = searchParams.get("detail") || "";
    const code = searchParams.get("code") || "";
    return getFailureExplanation({ reason, detail, code });
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pt-24 pb-16">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-red-700">{title}</h1>
        <p className="mt-2 text-sm text-[#5f6475]">{body}</p>
        {hint ? (
          <p className="mt-3 rounded-lg bg-[#f4f6fb] px-3 py-2 text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
        <Button asChild className="mt-6 w-full bg-[#FC8019] hover:bg-[#ea7310]">
          <Link to="/checkout">Try again</Link>
        </Button>
      </div>
    </main>
  );
};

export default PaymentFailed;
