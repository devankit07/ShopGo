import React, { useEffect, useRef } from "react";
import { CreditCard, Gem, ShieldCheck, Truck } from "lucide-react";
import { motion as Motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Trusted Protection",
    description: "Enterprise-grade encryption keeps every order fully secure.",
  },
  {
    icon: CreditCard,
    title: "Lightning Checkout",
    description: "One-tap payment flow designed for speed and confidence.",
  },
  {
    icon: Truck,
    title: "Priority Delivery",
    description: "Fast dispatch and reliable last-mile tracking to your door.",
  },
  {
    icon: Gem,
    title: "Curated Quality",
    description: "Every product is selected to meet premium style standards.",
  },
];

const WhyShopGo = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_0%,#fff6ee_0%,#f8f8f8_45%,#f4f6fb_100%)] py-16 md:py-20"
    >
      <div className="pointer-events-none absolute -top-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[#fc8019]/15 blur-3xl" />
      <div className="max-w-7xl mx-auto px-6">
        <Motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45 }}
          className="mb-12 text-center text-3xl font-bold text-[#282C3F] md:text-4xl"
        >
          Why Choose <span className="text-[#fc8019]">SHOP-GO</span>
        </Motion.h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Motion.article
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.38, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-[#eceef4] bg-white p-6 shadow-[0_12px_34px_-20px_rgba(40,44,63,0.26)] transition-all duration-300 hover:border-[#fc8019]/40 hover:shadow-[0_24px_45px_-22px_rgba(252,128,25,0.35)]"
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  rotateX: 6,
                  rotateY: -5,
                  transition: { type: "spring", stiffness: 250, damping: 18 },
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,128,25,0.22),transparent_55%)]" />
                </div>
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#fc8019]/40 bg-[#fff5f0] text-[#fc8019] transition-all duration-300 group-hover:shadow-[0_0_26px_rgba(252,128,25,0.35)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="relative mt-4 text-lg font-semibold text-[#282C3F]">{benefit.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-[#5f6475]">{benefit.description}</p>
              </Motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyShopGo;
