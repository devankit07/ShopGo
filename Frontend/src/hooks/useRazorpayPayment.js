import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createPaymentOrder,
  loadRazorpayScript,
  openRazorpayCheckout,
  resolveRazorpayKeyId,
} from "@/lib/razorpay";
import { buildFailedQueryString } from "@/lib/paymentFailure";

function navigateToFailed(navigate, payload) {
  const qs = buildFailedQueryString(payload);
  navigate(qs ? `/failed?${qs}` : "/failed");
}

function toastForCheckoutFailure(payload) {
  if (!payload?.reason) {
    toast.error("Payment could not be completed.");
    return;
  }
  switch (payload.reason) {
    case "user_closed":
      toast.info("You closed the payment window before completing checkout.");
      break;
    case "payment_failed":
      toast.error(
        payload.description ||
          payload.message ||
          "Payment was declined or could not be completed."
      );
      break;
    case "config":
      toast.error(payload.message || "Payment setup error.");
      break;
    default:
      toast.error(payload.message || payload.description || "Payment failed.");
  }
}

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
              toast.error("No payment confirmation received.");
              navigateToFailed(navigate, { reason: "no_payment_id" });
            }
          } catch (error) {
            toast.error(
              error?.message || "Payment succeeded but order could not be saved."
            );
            navigateToFailed(navigate, {
              reason: "order_save",
              detail: error?.message,
            });
          } finally {
            setIsPaying(false);
          }
        },
        onFailure: (payload) => {
          setIsPaying(false);
          toastForCheckoutFailure(payload || { reason: "unknown" });
          navigateToFailed(navigate, payload || { reason: "unknown" });
        },
      });
    } catch (error) {
      setIsPaying(false);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Payment initialization failed.";
      toast.error(msg);
      navigateToFailed(navigate, {
        reason: "init_error",
        detail: msg,
      });
    }
  };

  return {
    startPayment,
    isPaying,
  };
};
