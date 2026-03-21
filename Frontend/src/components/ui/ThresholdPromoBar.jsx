import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/**
 * Zepto-style floating promo: blue pill, lime highlights, optional cart meta + progress.
 */
export default function ThresholdPromoBar({
  visible,
  onDismiss,
  progressPercent,
  highlightLine,
  rightLabel = "Cart",
  itemCount = 0,
  thumbUrl,
  showCartMeta = true,
  className,
}) {
  if (!visible) return null;

  const pct = Math.min(100, Math.max(0, progressPercent));

  return (
    <div
      className={cn(
        "fixed left-3 right-3 z-[60] max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none md:left-auto md:right-6 md:mx-0",
        "max-md:bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative overflow-hidden rounded-[1.35rem] bg-[#2563eb] px-4 pb-3 pt-3.5 text-white shadow-[0_12px_40px_rgba(37,99,235,0.45)] ring-1 ring-white/20">
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-full p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>

        <div className={cn("flex items-center gap-3", showCartMeta ? "pr-7" : "pr-8")}>
          <div className="min-w-0 flex-1 text-sm font-medium leading-snug">
            {highlightLine}
          </div>
          {showCartMeta ? (
            <div className="flex shrink-0 items-center gap-2.5">
              <div className="text-right">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-white/90">
                  {rightLabel}
                </p>
                <p className="text-xs text-white/80">
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </p>
              </div>
              {thumbUrl ? (
                <img
                  src={thumbUrl}
                  alt=""
                  className="size-11 rounded-lg object-cover ring-2 ring-white/40"
                />
              ) : (
                <div className="size-11 rounded-lg bg-white/15 ring-2 ring-white/25" />
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25">
          <div
            className="relative h-full rounded-full bg-[#bef264] transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
          >
            <span
              className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.95)]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
