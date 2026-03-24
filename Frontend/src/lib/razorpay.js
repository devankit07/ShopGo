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
  const response = await axios.post("/api/create-order", { amount });
  return response.data?.order;
};

export const openRazorpayCheckout = ({
  order,
  onSuccess,
  onFailure,
  name = "ShopGo",
  description = "Order payment",
}) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name,
    description,
    handler: onSuccess,
    modal: {
      ondismiss: onFailure,
    },
    theme: {
      color: "#FC8019",
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.on("payment.failed", onFailure);
  razorpayInstance.open();
};
