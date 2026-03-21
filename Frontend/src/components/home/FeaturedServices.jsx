import React from "react";
import { Truck, Headphones, ShieldCheck, Award } from "lucide-react";

const SERVICES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Enjoy free delivery on selected orders above ₹999.",
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
    <section className="py-16 md:py-20 bg-white border-y border-[#e9e9eb]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#282C3F] mb-12">
          Shop With <span className="text-[#fc8019]">Confidence</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group p-6 rounded-2xl bg-[#f8f8f8] border border-[#e9e9eb] hover:border-[#fc8019]/35 hover:shadow-[0_8px_30px_rgba(252,128,25,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-[#fc8019]/35 bg-white text-[#fc8019] group-hover:shadow-[0_0_20px_rgba(252,128,25,0.18)] transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#282C3F]">{service.title}</h3>
                <p className="mt-2 text-sm text-[#7E808C]">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
