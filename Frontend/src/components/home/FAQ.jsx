import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";

const FAQ_ITEMS = [

  {
    question: "What is your return policy?",
    answer: "We offer a hassle-free return within 7 days of delivery for most items. Products must be unused and in original packaging. Visit our Returns Policy page for full details.",
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes! Free shipping is available on orders above ₹999. Delivery typically takes 3–7 business days depending on your location.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets. All transactions are secured with encryption.",
  },
  {
    question: "How do I contact customer support?",
    answer: "Our support team is available 24/7. You can reach us via the Help Center, live chat on the website, or by email at support@shopgo.com.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-[linear-gradient(180deg,#f7f8fb_0%,#f4f5f9_100%)] py-14 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#282C3F] mb-10">
          Frequently Asked <span className="text-[#fc8019]">Questions</span>
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <Motion.div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/70 bg-white/60 shadow-[0_14px_34px_-26px_rgba(40,44,63,0.6)] backdrop-blur-md transition-all duration-300 hover:border-[#fc8019]/35"
              whileHover={{ y: -2 }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-[#282C3F]"
              >
                <span className="text-sm md:text-base">{item.question}</span>
                <Motion.span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff4eb] text-[#fc8019]"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {openIndex === index ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <Motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-[#eceef4] px-5 pb-4 pt-3 text-sm leading-relaxed text-[#6d7185]">
                      {item.answer}
                    </p>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
