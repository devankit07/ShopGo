import React from "react";
import { Link } from "react-router-dom";
import DarkMeshBackdrop from "@/components/ui/DarkMeshBackdrop";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/cart", label: "Orders" },
  { to: "/login", label: "Account" },
];

const CUSTOMER_SUPPORT = [
  { label: "Help Center", href: "#" },
  { label: "Contact", href: "#" },
];

const CATEGORIES = [
  { label: "Electronics", to: "/products?category=electronics" },
  { label: "Jewellery", to: "/products?category=jewellery" },
  { label: "Accessories", to: "/products?category=accessories" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#030508] text-[#b8c4d9]">
      <DarkMeshBackdrop glow="top" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            <Link to="/" className="mb-4 inline-block transition-transform hover:scale-[1.02]">
              <img src="/icon.png" alt="SHOP-GO" className="h-10 w-auto object-contain" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#9aa6bc]">
              Your trusted destination for electronics, lifestyle products, and more. Quality, value, and fast delivery—every time.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="transition-colors hover:text-[#fc8019]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Customer Support
            </h3>
            <ul className="space-y-3 text-sm">
              {CUSTOMER_SUPPORT.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="transition-colors hover:text-[#fc8019]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="space-y-3 text-sm">
              {CATEGORIES.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="transition-colors hover:text-[#fc8019]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs uppercase tracking-widest text-[#8b95b0]">
            © 2026 <span className="font-bold text-[#fc8019]">SHOP-GO</span>. All rights reserved.
          </p>
          <Link
            to="/give-feedback"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#fc8019] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#ea7310]"
          >
            Give Feedback
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
