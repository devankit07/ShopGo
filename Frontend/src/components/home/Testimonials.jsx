import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya S.",
    text: "Fast delivery and great quality. SHOP-GO is my go-to for electronics and gifts.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
  {
    name: "Rahul M.",
    text: "Best prices I've found online. Customer support resolved my query in minutes.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  },
  {
    name: "Anita K.",
    text: "Smooth checkout and secure payment. Will definitely order again.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita",
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[index];

  return (
    <section className="py-16 md:py-20 bg-[#0a0e12] border-y border-white/5">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          What Our <span className="text-orange-400">Customers</span> Say
        </h2>
        <div className="relative">
          <div
            key={index}
            className="p-8 rounded-2xl bg-[#161d26] border border-white/10 animate-in fade-in duration-500"
          >
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full mx-auto border-2 border-teal-500/50 object-cover"
            />
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
              ))}
            </div>
            <p className="mt-4 text-gray-300 italic">&ldquo;{t.text}&rdquo;</p>
            <p className="mt-3 font-semibold text-white">{t.name}</p>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2 items-center">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-teal-500" : "w-2 bg-white/30"}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
              className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
