import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createPaymentOrder,
  loadRazorpayScript,
  openRazorpayCheckout,
  resolveRazorpayKeyId,
} from "@/lib/razorpay";

export const useRazorpayPayment = () => {
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);

  /**
   * @param {object} opts
   * @param {number} opts.amount — rupees (e.g. 499)
   * @param {string} [opts.name]
   * @param {string} [opts.description]
   * @param {(response: object) => Promise<void> | void} [opts.afterPaymentSuccess] — runs after Razorpay succeeds, before redirect to /success
   */
  const startPayment = async ({
    amount,
    name,
    description,
    afterPaymentSuccess,
  }) => {
    setIsPaying(true);
    try {
      const keyId = await resolveRazorpayKeyId();

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
        key: keyId,
        name,
        description,
        onSuccess: async (response) => {
          try {
            if (afterPaymentSuccess) {
              await afterPaymentSuccess(response);
            }
            const paymentId = response?.razorpay_payment_id;
            if (paymentId) {
              navigate(`/success?payment_id=${paymentId}`);
            } else {
              navigate("/failed");
            }
          } catch (error) {
            toast.error(
              error?.message || "Payment succeeded but order could not be saved."
            );
            navigate("/failed");
          } finally {
            setIsPaying(false);
          }
        },
        onFailure: () => {
          setIsPaying(false);
          toast.error("Payment cancelled");
          navigate("/failed");
        },
      });
    } catch (error) {
      setIsPaying(false);
      toast.error(error?.message || "Payment initialization failed.");
      navigate("/failed");
    }
  };

  return {
    startPayment,
    isPaying,
  };
};
