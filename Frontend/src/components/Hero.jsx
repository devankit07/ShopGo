import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white pt-24 pb-16 md:pt-28 md:pb-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[80%] h-full bg-gradient-to-bl from-[#fff5f0] via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/3 -left-1/4 w-[70%] h-[70%] bg-gradient-to-tr from-[#fc8019]/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#fc8019]/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#282C3F] leading-[1.1]">
            Shop Smart.{" "}
            <span className="bg-gradient-to-r from-[#fc8019] to-[#ff9f45] bg-clip-text text-transparent">
              Get It Fast.
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#7E808C] leading-relaxed max-w-xl">
            Discover trending products, unbeatable deals, and lightning-fast delivery all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button
              asChild
              className="h-12 px-8 rounded-xl bg-[#fc8019] text-white font-bold shadow-lg shadow-[#fc8019]/25 hover:bg-[#ea7310]"
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
