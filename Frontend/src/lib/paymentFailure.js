/**
 * Maps Razorpay / app failure payloads to URL-safe query params for /failed.
 * @param {{ reason?: string, code?: string, description?: string, message?: string }} payload
 */
export function buildFailedQueryString(payload = {}) {
  const params = new URLSearchParams();
  const reason = payload.reason || "unknown";
  params.set("reason", reason);

  const detail =
    payload.description ||
    payload.message ||
    (typeof payload.detail === "string" ? payload.detail : "");
  if (detail) {
    params.set("detail", detail.slice(0, 400));
  }
  if (payload.code != null && payload.code !== "") {
    params.set("code", String(payload.code));
  }
  return params.toString();
}

/** User-facing copy for the failure page (no raw codes unless helpful). */
export function getFailureExplanation({ reason, detail, code }) {
  switch (reason) {
    case "user_closed":
      return {
        title: "Payment not completed",
        body: "You closed the payment window before finishing. You can try again whenever you’re ready.",
      };
    case "payment_failed": {
      const out = {
        title: "Payment declined",
        body:
          detail ||
          "Your bank or Razorpay could not complete this payment. Try another method or card.",
      };
      if (code) out.hint = `Error code: ${code}`;
      return out;
    }
    case "init_error":
      return {
        title: "Couldn’t start payment",
        body: detail || "Check your connection and try again.",
      };
    case "order_save":
      return {
        title: "Payment received",
        body: detail || "We couldn’t save your order after payment. Please contact support with your payment ID.",
      };
    case "no_payment_id":
      return {
        title: "Payment incomplete",
        body: "We didn’t receive a payment confirmation. If money was debited, contact support.",
      };
    case "config":
      return {
        title: "Payment unavailable",
        body: detail || "Razorpay isn’t configured correctly.",
      };
    default:
      return {
        title: "Payment failed",
        body:
          detail ||
          "Something went wrong. Please try again or use another payment method.",
      };
  }
}
