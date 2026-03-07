import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#262a30] pt-24 pb-16 md:pt-28 md:pb-20">
      {/* Animated gradient glow background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-500/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Shop Smart.{" "}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Get It Fast.
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
            Discover trending products, unbeatable deals, and lightning-fast delivery all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button
              asChild
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold"
            >
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
