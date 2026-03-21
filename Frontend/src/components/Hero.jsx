import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import HeroAmazonBanner from "@/components/home/HeroAmazonBanner";

const Hero = () => {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-white pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/4 -top-1/2 h-full w-[80%] rounded-full bg-gradient-to-bl from-[#fff5f0] via-transparent to-transparent blur-3xl animate-pulse-slow" />
        <div
          className="absolute -bottom-1/3 -left-1/4 h-[70%] w-[70%] rounded-full bg-gradient-to-tr from-[#fc8019]/10 via-transparent to-transparent blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fc8019]/5 blur-3xl animate-float" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#282C3F] md:text-6xl lg:text-7xl">
              Shop Smart.{" "}
              <span className="bg-gradient-to-r from-[#fc8019] to-[#ff9f45] bg-clip-text text-transparent">
                Get It Fast.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#7E808C] md:text-xl">
              Discover trending products, unbeatable deals, and lightning-fast delivery all in one place.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-xl bg-[#fc8019] px-8 font-bold text-white shadow-lg shadow-[#fc8019]/25 hover:bg-[#ea7310]"
              >
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          </div>

          <div className="relative lg:justify-self-end">
            <HeroAmazonBanner />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
