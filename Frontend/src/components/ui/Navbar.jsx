import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userslice";
import { selectCartCount } from "@/redux/cartSlice";

const BRAND_LOGO = (
  <img
    src="/icon.png"
    alt="SHOP-GO"
    className="h-9 w-auto object-contain sm:h-10 md:h-11"
  />
);

const Navbar = () => {
  const { user } = useSelector((state) => state.User);
  const cartCount = useSelector(selectCartCount);

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
        },
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
          className="flex items-center gap-2 transition-transform hover:scale-[1.02]"
        >
          {BRAND_LOGO}
        </Link>

        <nav className="flex items-center gap-10">
          <ul className="hidden md:flex gap-8 items-center text-[15px] font-bold text-[#3E4152] uppercase tracking-wide">
            <Link
              to="/"
              className="hover:text-[var(--brand-accent)] transition-colors relative group"
            >
              <li className="leading-[1.2em]">
                <span
                  className="block h-[1.2em] overflow-hidden"
                  style={{ lineHeight: "1.2em" }}
                >
                  <span
                    className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2"
                    style={{ width: "max-content" }}
                  >
                    <span className="h-[1.2em] flex items-center shrink-0">Home</span>
                    <span className="h-[1.2em] flex items-center shrink-0">Home</span>
                  </span>
                </span>
              </li>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-accent)] transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/products"
              className="hover:text-[var(--brand-accent)] transition-colors relative group"
            >
              <li className="leading-[1.2em]">
                <span
                  className="block h-[1.2em] overflow-hidden"
                  style={{ lineHeight: "1.2em" }}
                >
                  <span
                    className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2"
                    style={{ width: "max-content" }}
                  >
                    <span className="h-[1.2em] flex items-center shrink-0">Products</span>
                    <span className="h-[1.2em] flex items-center shrink-0">Products</span>
                  </span>
                </span>
              </li>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-accent)] transition-all group-hover:w-full"></span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="hover:text-[var(--brand-accent)] transition-colors relative group"
              >
                <li className="leading-[1.2em]">
                  <span
                    className="block h-[1.2em] overflow-hidden"
                    style={{ lineHeight: "1.2em" }}
                  >
                    <span
                      className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2"
                      style={{ width: "max-content" }}
                    >
                      <span className="h-[1.2em] flex items-center shrink-0">Dashboard</span>
                      <span className="h-[1.2em] flex items-center shrink-0">Dashboard</span>
                    </span>
                  </span>
                </li>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-accent)] transition-all group-hover:w-full"></span>
              </Link>
            )}

            {user && (
              <Link
                to={`/profile/${user._id}`} 
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-[10px] text-white">
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
              className="relative group text-[#3E4152] hover:text-[var(--brand-accent)] transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-3 bg-[var(--brand-accent)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <Button
                onClick={logouthandler}
                variant="ghost"
                className="text-[#3E4152] font-bold hover:text-[var(--brand-accent)] hover:bg-orange-50 transition-all px-4"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-[var(--brand-accent)] hover:opacity-90 text-white font-bold px-8 rounded-md  transition-all active:scale-95"
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
