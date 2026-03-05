import React from "react";
import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/cart", label: "Orders" },
  { to: "/login", label: "Account" },
];

const CUSTOMER_SUPPORT = [
  { label: "Help Center", href: "#" },
  { label: "Shipping Info", href: "#" },
  { label: "Returns Policy", href: "#" },
  { label: "Contact", href: "#" },
];

const CATEGORIES = [
  { label: "Electronics", to: "/products?category=electronics" },
  { label: "Electric Vehicles", to: "/products?category=electric-vehicles" },
  { label: "Jewellery", to: "/products?category=jewellery" },
  { label: "Accessories", to: "/products?category=accessories" },
];

const Footer = () => {
  return (
    <footer className="bg-[#262a30] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo + description */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col">
            <Link to="/" className="inline-block transition-transform hover:scale-[1.02] mb-4">
              <img src="/icon.png" alt="SHOP-GO" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Your trusted destination for electronics, lifestyle products, and more. Quality, value, and fast delivery—every time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-teal-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Customer Support
            </h3>
            <ul className="space-y-3 text-sm">
              {CUSTOMER_SUPPORT.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="hover:text-teal-400 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Categories
            </h3>
            <ul className="space-y-3 text-sm">
              {CATEGORIES.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-teal-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row: copyright + view feedback link */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            © 2026 <span className="font-bold text-teal-400">SHOP-GO</span>. All rights reserved.
          </p>
          <Link
            to="/give-feedback"
            className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors shrink-0"
          >
            Give Feedback
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
