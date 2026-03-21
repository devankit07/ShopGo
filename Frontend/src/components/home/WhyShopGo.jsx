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
    <section className="py-16 md:py-20 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#282C3F] mb-12">
          Why Choose <span className="text-[#fc8019]">SHOP-GO</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative p-6 rounded-2xl bg-white border border-[#e9e9eb] shadow-sm hover:border-[#fc8019]/40 hover:shadow-[0_8px_30px_rgba(252,128,25,0.12)] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-[#fc8019]/40 bg-[#fff5f0] text-[#fc8019] group-hover:shadow-[0_0_20px_rgba(252,128,25,0.2)] transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#282C3F]">{benefit.title}</h3>
                <p className="mt-2 text-sm text-[#7E808C]">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyShopGo;
