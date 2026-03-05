import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function getTimeLeft() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end - now);
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return { h, m, s };
}

const SpecialDeal = () => {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section id="deals" className="py-16 md:py-20 bg-[#0f1419]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500/20 via-[#161d26] to-orange-500/20 border border-teal-500/30 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                Today&apos;s <span className="text-teal-400">Mega Deal</span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-xl">
                Limited time offers on trending electronics and lifestyle products.
              </p>
              <div className="flex gap-3 mt-6">
                <div className="flex flex-col items-center rounded-xl bg-[#0a0e12]/80 border border-white/10 px-4 py-3 min-w-[70px]">
                  <span className="text-2xl font-bold text-teal-400">{pad(time.h)}</span>
                  <span className="text-xs text-gray-500">Hours</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-[#0a0e12]/80 border border-white/10 px-4 py-3 min-w-[70px]">
                  <span className="text-2xl font-bold text-teal-400">{pad(time.m)}</span>
                  <span className="text-xs text-gray-500">Mins</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-[#0a0e12]/80 border border-white/10 px-4 py-3 min-w-[70px]">
                  <span className="text-2xl font-bold text-teal-400">{pad(time.s)}</span>
                  <span className="text-xs text-gray-500">Secs</span>
                </div>
              </div>
            </div>
            <Button
              asChild
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-lg shadow-teal-500/30 hover:opacity-95"
            >
              <Link to="/products">Shop Deals</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialDeal;
