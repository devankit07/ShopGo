import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    <section className="py-16 md:py-20 bg-[#262a30] border-y border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
          Frequently Asked <span className="text-teal-400">Questions</span>
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-[#2d3136] border border-white/10 overflow-hidden transition-all duration-300 hover:border-teal-500/30"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-white font-medium"
              >
                <span className="text-sm md:text-base">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-teal-400 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
