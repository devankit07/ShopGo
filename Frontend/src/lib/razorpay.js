import axios from "axios";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const createPaymentOrder = async (amount) => {
  try {
    const response = await axios.post("/api/payment/create-order", { amount });
    return response.data?.order;
  } catch (error) {
    if (error?.response?.status === 404) {
      // Legacy fallback while older backend builds still use /api/create-order.
      const fallback = await axios.post("/api/create-order", { amount });
      return fallback.data?.order;
    }
    throw error;
  }
};

let cachedKeyId = null;

/**
 * Resolves the public Razorpay key_id: VITE_RAZORPAY_KEY_ID if set, otherwise from the backend
 * (same RAZORPAY_KEY_ID you use on the server — no duplicate .env needed for local dev).
 */
export const resolveRazorpayKeyId = async () => {
  const fromEnv = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (fromEnv) return fromEnv;
  if (cachedKeyId) return cachedKeyId;
  try {
    const { data } = await axios.get("/api/payment/config");
    if (!data?.success || !data?.keyId) {
      throw new Error(
        data?.message ||
          "Razorpay is not configured. Add RAZORPAY_KEY_ID to the backend .env and restart."
      );
    }
    cachedKeyId = data.keyId;
    return cachedKeyId;
  } catch (e) {
    const msg =
      e.response?.data?.message ||
      (e.code === "ECONNREFUSED" || e.message?.includes("Network")
        ? "Cannot reach the API. Start the backend on port 8000 (npm start in Backend)."
        : null);
    throw new Error(
      msg || e.message || "Could not load Razorpay configuration."
    );
  }
};

export const verifyPaymentOnServer = async (paymentResponse) => {
  const response = await axios.post("/api/payment/verify", {
    razorpay_order_id: paymentResponse?.razorpay_order_id,
    razorpay_payment_id: paymentResponse?.razorpay_payment_id,
    razorpay_signature: paymentResponse?.razorpay_signature,
  });
  return Boolean(response?.data?.success);
};

export const openRazorpayCheckout = ({
  order,
  key,
  onSuccess,
  onFailure,
  name = "ShopGo",
  description = "Order payment",
}) => {
  if (!key) {
    onFailure?.({
      reason: "config",
      message: "Razorpay checkout key is missing.",
    });
    return;
  }

  let failureHandled = false;
  const notifyFailure = (payload) => {
    if (failureHandled) return;
    failureHandled = true;
    onFailure?.(payload);
  };

  const options = {
    key,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name,
    description,
    handler: (response) => {
      void Promise.resolve(onSuccess(response)).catch(() => {
        /* Errors after success are handled inside onSuccess (e.g. order save). */
      });
    },
    modal: {
      ondismiss: () => {
        notifyFailure({ reason: "user_closed" });
      },
    },
    theme: {
      color: "#FC8019",
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.on("payment.failed", (response) => {
    const err = response?.error || {};
    notifyFailure({
      reason: "payment_failed",
      code: err.code,
      description: err.description,
      source: err.source,
      step: err.step,
    });
  });
  razorpayInstance.open();
};
