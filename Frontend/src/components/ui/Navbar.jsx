import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userslice";

const Navbar = () => {
  const { user } = useSelector((state) => state.User);

  const accesstoken = localStorage.getItem("accesstoken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logouthandler = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
        }
      );
      if (response.data.success) {
        dispatch(setUser(null));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="fixed top-0 left-0 w-full z-20 bg-white/10 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        <Link
          to="/"
          className="flex items-center transition-transform hover:scale-105"
        >
          <img
            src="/logo.png"
            alt="ShopGo Logo"
            className="w-[100px] h-auto object-contain"
          />
        </Link>

        <nav className="flex items-center gap-10">
          <ul className="hidden md:flex gap-8 items-center text-[15px] font-bold text-[#3E4152] uppercase tracking-wide">
            <Link
              to="/"
              className="hover:text-[#FF3F6C] transition-all relative group"
            >
              <li>Home</li>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF3F6C] transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/products"
              className="hover:text-[#FF3F6C] transition-all relative group"
            >
              <li>Products</li>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF3F6C] transition-all group-hover:w-full"></span>
            </Link>

            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              >
                <div className="w-6 h-6 bg-[#FF3F6C] rounded-full flex items-center justify-center text-[10px] text-white">
                  {user.firstName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-[#3E4152]">
                  Hi, {user.firstName}
                </span>
              </Link>
            )}
          </ul>

          <div className="flex items-center gap-6 border-l pl-8 border-gray-300">
            <Link
              to="/cart"
              className="relative group text-[#3E4152] hover:text-[#FF3F6C] transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-3 bg-[#FF3F6C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md group-hover:scale-110 transition-transform">
                0
              </span>
            </Link>

            {user ? (
              <Button
                onClick={logouthandler}
                variant="ghost"
                className="text-[#3E4152] font-bold hover:text-[#FF3F6C] hover:bg-pink-50 transition-all px-4"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-[#FF3F6C] hover:bg-[#e0355f] text-white font-bold px-8 rounded-md shadow-md shadow-pink-100 transition-all active:scale-95"
              >
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
