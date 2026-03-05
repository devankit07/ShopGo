import React, { useState } from "react";

const BANNER_ITEMS = [
  "🔥 Flash Deals – Limited Time Discounts",
  "🚚 Free Shipping on Orders Above ₹999",
  "⚡ Fast Checkout – Secure Payments",
  "💎 Premium Products at Affordable Prices",
  "🎁 Daily Surprise Offers for Members",
];

const DealsBanner = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      className="relative py-4 overflow-hidden bg-[#262a30]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative flex overflow-hidden">
        <div
          className="flex animate-scroll-banner shrink-0 home-deals-track"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {[...BANNER_ITEMS, ...BANNER_ITEMS].map((text, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-6 px-6 py-2.5 rounded-full border border-teal-400/40 bg-[#2d3136] text-white text-sm md:text-base font-medium whitespace-nowrap shadow-[0_0_24px_rgba(20,184,166,0.25)] hover:shadow-[0_0_32px_rgba(20,184,166,0.4)] hover:border-teal-400/60 transition-all duration-300 [text-shadow:0_0_20px_rgba(20,184,166,0.4)]"
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsBanner;
