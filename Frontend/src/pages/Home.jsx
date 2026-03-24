import Hero from "@/components/Hero";
import GuestHomeThresholdBanner from "@/components/promo/GuestHomeThresholdBanner";
import DealsBanner from "@/components/home/DealsBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyShopGo from "@/components/home/WhyShopGo";
import TrustStats from "@/components/home/TrustStats";
import FAQ from "@/components/home/FAQ";
import PremiumCTA from "@/components/home/PremiumCTA";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <GuestHomeThresholdBanner />
      <Hero />
      <DealsBanner />
      <FeaturedProducts />
      <WhyShopGo />
      <TrustStats />
      <FAQ />
      <DealsBanner bannerText="SHOP NOW" />
      <PremiumCTA />
      <Footer />
    </div>
  );
};

export default Home;
