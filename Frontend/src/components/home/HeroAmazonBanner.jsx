import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  "/banner/pro1.jpg",
  "/banner/pro2.jpg",
  "/banner/pro3.jpg",
  "/banner/pro4.jpg",
  "/banner/pro5.jpg",
];

const AUTO_MS = 4500;

export default function HeroAmazonBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta) => {
    setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      AUTO_MS
    );
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <div
      className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-[#e9e9eb] bg-[#f8f8f8] shadow-[0_24px_60px_-16px_rgba(252,128,25,0.22)]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured products"
      >
        <div className="relative aspect-[16/10] sm:aspect-[5/3]">
          {SLIDES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Featured product ${i + 1} of ${SLIDES.length}`}
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none",
                i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
              )}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-black/25 to-transparent" />

        <button
          type="button"
          onClick={() => go(-1)}
          className="pointer-events-auto absolute left-2 top-1/2 z-[3] flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#e9e9eb] bg-white/95 text-[#282C3F] shadow-md transition hover:bg-white hover:text-[#fc8019] sm:left-3 sm:size-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5 sm:size-6" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="pointer-events-auto absolute right-2 top-1/2 z-[3] flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#e9e9eb] bg-white/95 text-[#282C3F] shadow-md transition hover:bg-white hover:text-[#fc8019] sm:right-3 sm:size-10"
          aria-label="Next slide"
        >
          <ChevronRight className="size-5 sm:size-6" />
        </button>

        <div className="absolute bottom-3 left-0 right-0 z-[3] flex justify-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index
                  ? "w-6 bg-white shadow-sm"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2 sm:mt-4 sm:gap-2.5">
        {SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all sm:h-14 sm:w-14",
              i === index
                ? "scale-105 border-[#fc8019] shadow-md ring-2 ring-[#fc8019]/25"
                : "border-transparent opacity-75 ring-1 ring-[#e9e9eb] hover:opacity-100"
            )}
            aria-label={`Show image ${i + 1}`}
            aria-current={i === index}
          >
            <img src={src} alt="" className="size-full object-cover" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
