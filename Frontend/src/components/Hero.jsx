import HeroAmazonBanner from "@/components/home/HeroAmazonBanner";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white pb-14 pt-24 md:pb-20 md:pt-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-[-45%] h-[88%] w-[56%] rounded-full bg-white blur-3xl" />
        <div
          className="absolute -right-1/3 top-[-35%] h-[75%] w-[70%] rounded-full bg-gradient-to-tr from-[#fc8019]/12 via-transparent to-transparent blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute bottom-[-26%] left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#fc8019]/10 blur-3xl animate-float" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6">
        <HeroAmazonBanner />
      </div>
    </section>
  );
};

export default Hero;
