import React from "react";
import { Truck, Headphones, ShieldCheck, Award } from "lucide-react";

const SERVICES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Enjoy free delivery on selected orders.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "Our support team is always ready to assist you.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Advanced encryption ensures safe transactions.",
  },
  {
    icon: Award,
    title: "Quality Assured Products",
    description: "Every product is verified for quality.",
  },
];

const FeaturedServices = () => {
  return (
    <section className="py-16 md:py-20 bg-[#262a30] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Shop With <span className="text-orange-400">Confidence</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-[#2d3136] border border-white/10 hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.12)] transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-orange-500/50 bg-orange-500/10 text-orange-400 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
