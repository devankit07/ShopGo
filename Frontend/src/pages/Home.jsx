import Hero from "@/components/Hero";
import GuestHomeThresholdBanner from "@/components/promo/GuestHomeThresholdBanner";
import DealsBanner from "@/components/home/DealsBanner";
import WhyShopGo from "@/components/home/WhyShopGo";
import FeaturedServices from "@/components/home/FeaturedServices";
import TrustStats from "@/components/home/TrustStats";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <GuestHomeThresholdBanner />
      <Hero />
      <DealsBanner />
      <WhyShopGo />
      <FeaturedServices />
      <TrustStats />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;
