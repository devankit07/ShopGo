import {
  CART_RULES,
  MAXCART_RULES,
  LABELS,
} from "./cartConstants";

export default function CartSavingsIntro() {
  return (
    <div className="mb-6 rounded-2xl border border-dashed border-orange-200/80 bg-orange-50/40 p-4 text-sm text-[#5c5f72] dark:border-orange-900/40 dark:bg-orange-950/20 dark:text-muted-foreground">
      <p className="mb-2 font-semibold text-[#282C3F] dark:text-foreground">
        Cart vs {LABELS.MAX_SHORT}
      </p>
      <ul className="list-disc space-y-1.5 pl-5 leading-relaxed">
        <li>
          <span className="font-medium text-foreground">{LABELS.CART_TAB}</span>{" "}
          — reach{" "}
          <span className="font-semibold text-[#FC8019]">
            ₹{CART_RULES.MIN_ORDER.toLocaleString()}+
          </span>{" "}
          to unlock savings. First order only:{" "}
          <span className="font-medium">
            ₹{CART_RULES.FIRST_ORDER_DISCOUNT.toLocaleString()} off
          </span>{" "}
          with code {CART_RULES.FIRST_ORDER_COUPON_CODE}.
        </li>
        <li>
          <span className="font-medium text-violet-700 dark:text-violet-300">
            {LABELS.MAX_TAB}
          </span>{" "}
          — reach{" "}
          <span className="font-semibold text-violet-700 dark:text-violet-300">
            ₹{MAXCART_RULES.MIN_ORDER.toLocaleString()}+
          </span>
          . First order:{" "}
          <span className="font-medium">
            ₹{MAXCART_RULES.FIRST_ORDER_DISCOUNT.toLocaleString()} off
          </span>{" "}
          ({MAXCART_RULES.FIRST_ORDER_COUPON_CODE}); after that,{" "}
          <span className="font-medium">
            ₹{MAXCART_RULES.REPEAT_ORDER_DISCOUNT.toLocaleString()} off
          </span>{" "}
          automatically every time.
        </li>
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Pick one mode with the tabs above — discounts don&apos;t combine.
      </p>
    </div>
  );
}
