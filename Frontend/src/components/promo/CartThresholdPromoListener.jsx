import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItems } from "@/redux/cartSlice";
import ThresholdPromoBar from "@/components/ui/ThresholdPromoBar";
import { CART_RULES, MAXCART_RULES, LABELS } from "@/components/cart/cartConstants";

function cartSubtotal(items) {
  return items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
}

function isProductShoppingPath(pathname) {
  return pathname === "/products" || pathname.startsWith("/product/");
}

/**
 * On /products and /product/:id, shows a Zepto-style bar when cart crosses ₹299 or ₹699.
 */
export default function CartThresholdPromoListener() {
  const location = useLocation();
  const items = useSelector(selectCartItems);
  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const prev = useRef(null);
  const [kind, setKind] = useState(null);

  const dismiss = useCallback(() => setKind(null), []);

  useEffect(() => {
    if (!isProductShoppingPath(location.pathname)) {
      prev.current = subtotal;
      return;
    }

    if (prev.current === null) {
      prev.current = subtotal;
      return;
    }

    const was = prev.current;
    const now = subtotal;
    prev.current = now;

    if (was >= now) return;

    let next = null;
    if (was < MAXCART_RULES.MIN_ORDER && now >= MAXCART_RULES.MIN_ORDER) {
      next = "max";
    } else if (was < CART_RULES.MIN_ORDER && now >= CART_RULES.MIN_ORDER) {
      next = "cart";
    }

    if (next) {
      window.setTimeout(() => setKind(next), 0);
    }
  }, [subtotal, location.pathname]);

  useEffect(() => {
    if (!kind) return;
    const ms = 5000 + Math.floor(Math.random() * 2001);
    const t = window.setTimeout(() => setKind(null), ms);
    return () => window.clearTimeout(t);
  }, [kind]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const thumb = items[0]?.image;

  if (!kind) return null;

  const highlightLine =
    kind === "max" ? (
      <>
        <span className="text-[#fef08a]">Congrats!</span> You unlocked{" "}
        <span className="font-bold text-[#d9f99d]">
          {LABELS.MAX_SHORT}
        </span>{" "}
        discount (₹{MAXCART_RULES.MIN_ORDER.toLocaleString()}+ cart).
      </>
    ) : (
      <>
        <span className="text-[#fef08a]">Congrats!</span> You unlocked{" "}
        <span className="font-bold text-[#d9f99d]">CART</span> discount
        (₹{CART_RULES.MIN_ORDER.toLocaleString()}+).
      </>
    );

  return (
    <ThresholdPromoBar
      visible
      onDismiss={dismiss}
      progressPercent={100}
      highlightLine={highlightLine}
      rightLabel="Cart"
      itemCount={count}
      thumbUrl={thumb}
    />
  );
}
