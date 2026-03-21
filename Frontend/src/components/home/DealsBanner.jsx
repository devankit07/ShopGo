import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const BANNER_TEXT = "SHOP WITH US";

const DealsBanner = () => {
  const [isPaused, setIsPaused] = useState(false);
  const repeatCount = 24;
  const items = Array(repeatCount).fill(BANNER_TEXT);

  return (
    <section
      className="relative py-3 overflow-hidden bg-[#fc8019] border-y border-[#ea7310]/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative flex overflow-hidden">
        <div
          className="flex animate-scroll-banner shrink-0 home-deals-track"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {[...items, ...items].map((text, i) => (
            <span
              key={i}
              className="flex items-center gap-2 flex-shrink-0 mx-8 text-white text-sm md:text-base font-bold uppercase tracking-widest whitespace-nowrap"
            >
              {text}
              <ArrowUpRight className="w-4 h-4 flex-shrink-0 text-white/90" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsBanner;
