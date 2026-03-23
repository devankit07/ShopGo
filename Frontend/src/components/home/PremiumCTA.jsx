import React from "react";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumCTA = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#f4f5f9] to-transparent" />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src="/cta.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,10,20,0.68),rgba(16,22,40,0.5))]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fc8019]/20 blur-3xl" />
        <div className="relative rounded-3xl border border-white/20 bg-[#11172a]/62 p-10 text-center shadow-[0_28px_70px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl md:p-14">
          <h2 className="text-3xl font-extrabold text-white md:text-5xl">
            Upgrade Your Style Today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#d7def2] md:text-base">
            Discover trend-forward picks, premium quality, and a checkout
            experience designed to feel effortless.
          </p>

          <Motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-8">
            <Link
              to="/products"
              className="cta-ripple inline-flex items-center gap-2 rounded-xl border border-[#ffcba0]/30 bg-[#fc8019] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_-16px_rgba(252,128,25,0.9)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(252,128,25,0.7)]"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumCTA;
