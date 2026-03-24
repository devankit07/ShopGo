import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    image: "/banner/headphone.png",
    title: "Immersive Wireless Sound",
    price: "$129",
    description: "Studio-quality clarity with deep bass and all-day comfort.",
    cta: "Shop Now",
    glow: "rgba(252, 128, 25, 0.48)",
  },
  {
    image: "/banner/watch.png",
    title: "Smartwatch For Every Move",
    price: "$179",
    description: "Track health, workouts, and notifications in a premium finish.",
    cta: "Add to Cart",
    glow: "rgba(255, 159, 69, 0.44)",
  },
  {
    image: "/banner/shoes.png",
    title: "Performance Street Sneakers",
    price: "$99",
    description: "Featherlight grip and cushioning made for daily momentum.",
    cta: "Shop Now",
    glow: "rgba(255, 164, 93, 0.42)",
  },
  {
    image: "/banner/ring.png",
    title: "Minimal Luxury Ring",
    price: "$59",
    description: "Polished elegance designed to elevate every outfit instantly.",
    cta: "Add to Cart",
    glow: "rgba(255, 209, 163, 0.34)",
  },
  {
    image: "/banner/dress.png",
    title: "Signature Evening Dress",
    price: "$149",
    description: "Tailored silhouette with soft comfort and premium detailing.",
    cta: "Shop Now",
    glow: "rgba(255, 196, 138, 0.36)",
  },
];

const AUTO_MS = 4500;

export default function HeroAmazonBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative mx-auto w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0e1220] shadow-[0_35px_100px_-40px_rgba(0,0,0,0.95)]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured products"
      >
        <div className="relative min-h-[540px] sm:min-h-[610px] md:min-h-[540px] lg:min-h-[560px]">
          {SLIDES.map((slide, i) => {
            const active = i === index;

            return (
              <article
                key={slide.image}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out motion-reduce:transition-none",
                  active ? "z-20 opacity-100" : "pointer-events-none z-0 opacity-0"
                )}
                aria-hidden={!active}
              >
                <div className="absolute inset-0 bg-[linear-gradient(110deg,#070b16_0%,#0d1426_47%,#172033_100%)]" />
                <div className="absolute -left-[14%] top-[-18%] h-[68%] w-[52%] rounded-full bg-[#03060f]/90 blur-3xl" />
                <div
                  className="absolute right-[8%] top-[18%] h-[52%] w-[40%] rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle at center, ${slide.glow} 0%, rgba(252, 128, 25, 0.12) 40%, rgba(252, 128, 25, 0) 75%)`,
                  }}
                />
                <div className="absolute bottom-[8%] right-[5%] h-[24%] w-[48%] rounded-full bg-black/40 blur-3xl" />
                <div className="absolute left-[-8%] top-[44%] h-40 w-40 rounded-full bg-[#fc8019]/10 blur-2xl" />

                <div className="relative grid h-full grid-cols-1 gap-2 px-5 pb-16 pt-12 sm:gap-5 sm:px-8 sm:pb-12 sm:pt-16 md:grid-cols-2 md:items-center md:gap-8 md:px-12 lg:px-14">
                  <div className="max-w-xl space-y-2.5 sm:space-y-3.5 md:max-w-[92%]">
                    <p
                      className={cn(
                        "text-[11px] font-medium tracking-[0.16em] text-[#ffb780] uppercase transition-all duration-700 sm:text-sm sm:tracking-[0.2em]",
                        active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                      )}
                    >
                      Shop-Go Premium Collection
                    </p>
                    <h2
                      className={cn(
                        "max-w-[16ch] text-[2.05rem] leading-[1.04] font-extrabold text-white drop-shadow-[0_8px_25px_rgba(0,0,0,0.65)] sm:max-w-[20ch] sm:text-4xl sm:leading-tight md:text-5xl transition-all duration-700",
                        active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                      )}
                    >
                      {slide.title}
                    </h2>
                    <p
                      className={cn(
                        "text-[1.7rem] font-bold text-[#ffd2ac] sm:text-2xl transition-all duration-700 delay-75",
                        active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                      )}
                    >
                      {slide.price}
                    </p>
                    <p
                      className={cn(
                        "max-w-[34ch] text-[1.01rem] leading-[1.45] text-[#d5dceb] sm:max-w-[42ch] sm:text-base sm:leading-relaxed transition-all duration-700 delay-100",
                        active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                      )}
                    >
                      {slide.description}
                    </p>
                    <div
                      className={cn(
                        "pt-1 sm:pt-2 transition-all duration-700 delay-150",
                        active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                      )}
                    >
                      <Button
                        asChild
                        className="h-10 rounded-xl bg-[#fc8019] px-6 font-semibold text-white shadow-[0_14px_28px_-12px_rgba(252,128,25,0.8)] hover:bg-[#e77210] sm:h-11 sm:px-7"
                      >
                        <Link to="/products">{slide.cta}</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="relative -mt-6 flex items-end justify-center sm:-mt-1 md:mt-0 md:items-start md:justify-end md:pr-3 lg:pr-6">
                    <div className="pointer-events-none absolute bottom-2 h-14 w-44 rounded-full bg-black/65 blur-2xl md:bottom-7 md:h-20 md:w-64 lg:w-72" />
                    <div
                      className={cn(
                        "relative hero-premium-float transition-transform duration-700",
                        active ? "scale-100 rotate-0" : "scale-95 rotate-[-3deg]"
                      )}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className={cn(
                          "h-[220px] w-[220px] object-contain drop-shadow-[0_28px_30px_rgba(0,0,0,0.52)] sm:h-[310px] sm:w-[310px] md:h-[380px] md:w-[380px] lg:h-[430px] lg:w-[430px] xl:h-[500px] xl:w-[500px] transition-all duration-700",
                          active ? "rotate-[-8deg] scale-100" : "rotate-[-12deg] scale-95"
                        )}
                        loading={i === 0 ? "eager" : "lazy"}
                        draggable={false}
                      />
                      <div className="pointer-events-none absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,184,128,0.18),transparent_62%)] blur-xl" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index
                  ? "w-7 bg-[#ffb780] shadow-[0_0_14px_rgba(252,128,25,0.75)]"
                  : "w-2 bg-white/45 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
