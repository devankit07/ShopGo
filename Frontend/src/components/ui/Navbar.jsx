import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";

const Navbar = () => {
  const user = true;
  return (
    <header className="bg-pink-50 fixed-w-full z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        {/*logo section */}

        <Link to="/">
          <img
            src="/logo.png"
            alt="ShopGo Logo"
            className="w-[100px] h-[100px] object-cover"
          />
        </Link>

        {/* nav section */}
        <nav className="flex gap-10 justify-between items-center">
          <ul className="hidden md:flex gap-8 items-center text-[16px] font-bold text-[#3E4152]">
            <Link to={"/"} className="hover:text-[#FF3F6C] transition-colors">
              <li>Home</li>
            </Link>
            <Link
              to={"/products"}
              className="hover:text-[#FF3F6C] transition-colors"
            >
              <li>Products</li>
            </Link>

            {user && (
              <Link
                to={"/profile"}
                className="hover:text-[#FF3F6C] transition-colors text-sm bg-gray-200 px-3 py-1 rounded-full border border-gray-200"
              >
                <li>Hello,User</li>
              </Link>
            )}
          </ul>
          <div className="flex items-center gap-8  border-l pl-6 border-gray-400">
            <Link to={"/cart"} className="relative">
              <ShoppingCart />
              <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2">
                0
              </span>
            </Link>
            {user ? (
              <Button className="text-white bg-pink-500 cursor-pointer">
                Logout
              </Button>
            ) : (
              <Button className="text-white bg-gradient-to-tl from-blue-600 to bg-purple-600 cursor-pointer">
                Login
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
