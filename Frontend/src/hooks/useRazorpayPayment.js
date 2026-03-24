import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createPaymentOrder,
  loadRazorpayScript,
  openRazorpayCheckout,
} from "@/lib/razorpay";

export const useRazorpayPayment = () => {
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);

  const startPayment = async ({ amount, name, description }) => {
    setIsPaying(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay checkout script.");
      }

      const order = await createPaymentOrder(amount);
      if (!order?.id) {
        throw new Error("Order creation failed.");
      }

      openRazorpayCheckout({
        order,
        name,
        description,
        onSuccess: (response) => {
          const paymentId = response?.razorpay_payment_id;
          if (paymentId) {
            navigate(`/success?payment_id=${paymentId}`);
          } else {
            navigate("/failed");
          }
        },
        onFailure: () => {
          toast.error("Payment cancelled");
          navigate("/failed");
        },
      });
    } catch (error) {
      toast.error(error?.message || "Payment initialization failed.");
      navigate("/failed");
    } finally {
      setIsPaying(false);
    }
  };

  return {
    startPayment,
    isPaying,
  };
};
