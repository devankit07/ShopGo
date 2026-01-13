import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#282c3f] text-gray-400 py-5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* 1. Info Section */}
        <div className="space-y-4">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img src="/logo.png" alt="ShopGo Logo" className="w-32 " />
          </Link>
          <p className="text-sm leading-relaxed">
            Powering Your World with the Best in Electronics. High-quality gadgets at unbeatable prices.
          </p>
          <div className="text-sm space-y-1">
            <p>Style City, NY 10001</p>
            <p className="text-white font-medium">support@shopgo.com</p>
          </div>
        </div>

        {/* 2. Customer Service */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-6">
            Customer Service
          </h3>
          <ul className="space-y-3 text-sm">
            {["Contact Us", "Shipping & Returns", "FAQs", "Order Tracking"].map((item) => (
              <li key={item} className="hover:text-[#FF3F6C] cursor-pointer transition-colors w-max">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Social Media */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Follow Us</h3>
          <div className="flex space-x-5 text-lg">
            {[
              { icon: <FaFacebookF />, color: "hover:bg-[#1877F2]" },
              { icon: <FaInstagram />, color: "hover:bg-[#E4405F]" },
              { icon: <FaTwitter />, color: "hover:bg-[#1DA1F2]" },
              { icon: <FaPinterestP />, color: "hover:bg-[#E60023]" },
            ].map((social, index) => (
              <div 
                key={index} 
                className={`w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${social.color} hover:text-white hover:border-transparent`}
              >
                {social.icon}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Newsletter */}
        <div className="space-y-4">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">
            Stay in the Loop
          </h3>
          <p className="text-xs leading-relaxed">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="flex mt-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-[#3e4152] border-none p-3 rounded-l-md text-white text-sm outline-none focus:ring-1 focus:ring-[#FF3F6C]"
            />
            <button
              type="submit"
              className="bg-[#FF3F6C] px-5 rounded-r-md text-white font-bold text-sm hover:bg-[#e0355f] transition-all active:scale-95"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-16 border-t border-gray-700/50 pt-8 text-center text-[12px] tracking-widest uppercase">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-[#FF3F6C] font-bold">ShopGo</span>. Premium Electronics Store.
        </p>
      </div>
    </footer>
  );
};

export default Footer;