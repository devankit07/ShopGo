import React from "react";
import { CreditCard, Tag, Truck } from "lucide-react";

const BENEFITS = [
  {
    icon: CreditCard,
    title: "Fast & Secure Payments",
    description: "Safe transactions with trusted payment gateways.",
  },
  {
    icon: Tag,
    title: "Affordable Pricing",
    description: "Best prices across multiple product categories.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description: "Fast and reliable shipping directly to your doorstep.",
  },
];

const WhyShopGo = () => {
  return (
    <section className="py-16 md:py-20 bg-[#262a30]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Why Choose <span className="text-teal-400">SHOP-GO</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative p-6 rounded-2xl bg-[#2d3136] border border-white/10 hover:border-teal-500/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.12)] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-teal-500/50 bg-teal-500/10 text-teal-400 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyShopGo;
