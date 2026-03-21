import React, { useState, useEffect, useRef } from "react";

const STATS = [
  { value: 10000, suffix: "+", label: "Happy Customers" },
  { value: 500, suffix: "+", label: "Products Available" },
  { value: 99, suffix: "%", label: "Customer Satisfaction" },
  { value: 24, suffix: "/7", label: "Customer Support" },
];

function useCountUp(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    if (!start) return;
    let rafId;
    const step = (ts) => {
      if (!startTime.current) startTime.current = ts;
      const elapsed = ts - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, start]);

  return count;
}

function AnimatedStat({ value, suffix, label }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const count = useCountUp(value, 2000, inView);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-[#282C3F]">
        <span className="text-[#fc8019]">{count.toLocaleString()}</span>
        {suffix}
      </p>
      <p className="mt-1 text-sm text-[#7E808C]">{label}</p>
    </div>
  );
}

const TrustStats = () => {
  return (
    <section className="py-16 md:py-20 bg-[#f8f8f8] border-y border-[#e9e9eb]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
