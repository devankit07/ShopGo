import { useEffect, useState, useCallback } from "react";
import ThresholdPromoBar from "@/components/ui/ThresholdPromoBar";
import { CART_RULES, MAXCART_RULES } from "@/components/cart/cartConstants";
import { getAccessToken } from "@/lib/authStorage";

const SESSION_KEY = "shopgo_guest_home_threshold_promo_v1";

function randomDurationMs() {
  return 5000 + Math.floor(Math.random() * 2001);
}

/**
 * One-time-per-session banner for guests on the home screen (5–7s).
 */
export default function GuestHomeThresholdBanner() {
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    try {
      if (getAccessToken()) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      return;
    }

    let hideId;
    const openId = window.setTimeout(() => {
      setVisible(true);
      hideId = window.setTimeout(() => setVisible(false), randomDurationMs());
    }, 0);
    return () => {
      window.clearTimeout(openId);
      if (hideId) window.clearTimeout(hideId);
    };
  }, []);

  const highlightLine = (
    <>
      Buy orders above{" "}
      <span className="font-bold text-[#d9f99d]">
        ₹{CART_RULES.MIN_ORDER.toLocaleString()}
      </span>{" "}
      for <span className="font-bold text-white">CART</span> or{" "}
      <span className="font-bold text-[#d9f99d]">
        ₹{MAXCART_RULES.MIN_ORDER.toLocaleString()}
      </span>{" "}
      for <span className="font-bold text-white">MAXCART</span>.
    </>
  );

  return (
    <ThresholdPromoBar
      visible={visible}
      onDismiss={dismiss}
      progressPercent={38}
      highlightLine={highlightLine}
      showCartMeta={false}
    />
  );
}
