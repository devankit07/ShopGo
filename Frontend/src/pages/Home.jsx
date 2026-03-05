import Hero from "@/components/Hero";
import DealsBanner from "@/components/home/DealsBanner";
import WhyShopGo from "@/components/home/WhyShopGo";
import FeaturedServices from "@/components/home/FeaturedServices";
import TrustStats from "@/components/home/TrustStats";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="dark min-h-screen bg-[#262a30]">
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
