import React, { useEffect, useRef } from "react";
import { Truck, ShieldCheck, Undo2, Zap } from "lucide-react";
import { motion as Motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SERVICES = [
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Protected checkout with multiple trusted payment methods.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Express shipping and live tracking on every eligible order.",
  },
  {
    icon: Undo2,
    title: "Easy Returns",
    description: "Simple return process with quick support when needed.",
  },
  {
    icon: Zap,
    title: "Instant Support",
    description: "Fast response from our team whenever you need help.",
  },
];

const FeaturedServices = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".confidence-title", {
        opacity: 0,
        y: 26,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
      gsap.from(".confidence-card", {
        opacity: 0,
        x: -40,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#f7f8fb] py-16 md:py-18"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="confidence-title mb-12 text-center text-3xl font-bold text-[#282C3F] md:text-4xl">
          Shop With <span className="text-[#fc8019]">Confidence</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Motion.article
                key={service.title}
                className="confidence-card group relative overflow-hidden rounded-2xl border border-[#eceef4] bg-gradient-to-b from-white to-[#fafbff] p-5 shadow-[0_10px_30px_-24px_rgba(40,44,63,0.6)]"
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,128,25,0.18),transparent_60%)]" />
                </div>
                <Motion.div
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#fc8019]/35 bg-[#fff8f3] text-[#fc8019] shadow-[0_0_0_rgba(252,128,25,0)]"
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 350, damping: 12 }}
                >
                  <Icon className="h-6 w-6" />
                </Motion.div>
                <h3 className="relative mt-4 text-lg font-semibold text-[#282C3F]">{service.title}</h3>
                <p className="relative mt-1.5 text-sm text-[#717489]">{service.description}</p>
              </Motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
