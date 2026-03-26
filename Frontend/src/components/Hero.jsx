import HeroAmazonBanner from "@/components/home/HeroAmazonBanner";
import DarkMeshBackdrop from "@/components/ui/DarkMeshBackdrop";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#030508] pb-14 pt-24 md:pb-20 md:pt-28">
      <DarkMeshBackdrop glow="bottom" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6">
        <HeroAmazonBanner />
      </div>
    </section>
  );
};

export default Hero;
