import { ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userslice";
import { selectCartCount } from "@/redux/cartSlice";
import MobileBottomNav from "./MobileBottomNav";

const BRAND_LOGO = (
  <img
    src="/icon.png"
    alt="SHOP-GO"
    className="h-9 w-auto object-contain sm:h-10 md:h-11"
  />
);

const ink = "text-[#282C3F]";

const Navbar = () => {
  const { user } = useSelector((state) => state.User);
  const cartCount = useSelector(selectCartCount);
  const [isScrolled, setIsScrolled] = useState(false);

  const accesstoken = localStorage.getItem("accesstoken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logouthandler = async () => {
    try {
      const response = await axios.post(
        "/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
        },
      );
      if (response.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("user");
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const barClass = isScrolled
    ? "mx-4 mt-3 mb-3 rounded-full border border-[#e9e9eb] bg-white/95 shadow-md backdrop-blur-xl"
    : "border border-transparent bg-transparent";

  const linkBase = `transition-colors relative group ${ink} hover:text-[#fc8019]`;
  const underline = "absolute -bottom-1 left-0 h-0.5 w-0 bg-[#fc8019] transition-all group-hover:w-full";

  return (
    <>
      <header className="fixed top-0 left-0 z-20 w-full transition-[background,border,box-shadow] duration-300">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 py-3 transition-all duration-300 ${barClass}`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            {BRAND_LOGO}
          </Link>

          <nav className="flex items-center gap-10">
            <ul
              className={`hidden items-center gap-8 text-[15px] font-bold uppercase tracking-wide md:flex ${ink}`}
            >
              <Link to="/" className={linkBase}>
                <li className="leading-[1.2em]">
                  <span
                    className="block h-[1.2em] overflow-hidden"
                    style={{ lineHeight: "1.2em" }}
                  >
                    <span
                      className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2"
                      style={{ width: "max-content" }}
                    >
                      <span className="flex h-[1.2em] shrink-0 items-center">Home</span>
                      <span className="flex h-[1.2em] shrink-0 items-center">Home</span>
                    </span>
                  </span>
                </li>
                <span className={underline} />
              </Link>
              <Link to="/products" className={linkBase}>
                <li className="leading-[1.2em]">
                  <span
                    className="block h-[1.2em] overflow-hidden"
                    style={{ lineHeight: "1.2em" }}
                  >
                    <span
                      className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2"
                      style={{ width: "max-content" }}
                    >
                      <span className="flex h-[1.2em] shrink-0 items-center">Products</span>
                      <span className="flex h-[1.2em] shrink-0 items-center">Products</span>
                    </span>
                  </span>
                </li>
                <span className={underline} />
              </Link>
              <Link to="/feedback" className={linkBase}>
                <li className="leading-[1.2em]">
                  <span
                    className="block h-[1.2em] overflow-hidden"
                    style={{ lineHeight: "1.2em" }}
                  >
                    <span
                      className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2"
                      style={{ width: "max-content" }}
                    >
                      <span className="flex h-[1.2em] shrink-0 items-center">Feedback</span>
                      <span className="flex h-[1.2em] shrink-0 items-center">Feedback</span>
                    </span>
                  </span>
                </li>
                <span className={underline} />
              </Link>

              {user?.role === "admin" && (
                <Link to="/admin" className={linkBase}>
                  <li className="leading-[1.2em]">
                    <span
                      className="block h-[1.2em] overflow-hidden"
                      style={{ lineHeight: "1.2em" }}
                    >
                      <span
                        className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2"
                        style={{ width: "max-content" }}
                      >
                        <span className="flex h-[1.2em] shrink-0 items-center">Dashboard</span>
                        <span className="flex h-[1.2em] shrink-0 items-center">Dashboard</span>
                      </span>
                    </span>
                  </li>
                  <span className={underline} />
                </Link>
              )}

              {user && (
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-2 rounded-full border border-[#e9e9eb] bg-white px-4 py-1.5 shadow-sm transition-colors hover:border-[#fc8019]/30 hover:bg-[#fffaf7]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fc8019] text-[10px] font-bold text-white">
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-sm font-semibold ${ink}`}>
                    Hi, {user.firstName}
                  </span>
                </Link>
              )}
            </ul>

            <div className="flex items-center gap-6 border-l border-[#e9e9eb] pl-8">
              <Link
                to="/cart"
                className={`group relative transition-colors ${ink} hover:text-[#fc8019]`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-3 -top-2 rounded-full bg-[#fc8019] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md transition-transform group-hover:scale-110">
                  {cartCount}
                </span>
              </Link>

              {user ? (
                <Button
                  onClick={logouthandler}
                  variant="ghost"
                  className={`px-4 font-bold ${ink} hover:bg-[#fff5f0] hover:text-[#fc8019]`}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="rounded-md bg-[#fc8019] px-8 font-bold text-white transition-all hover:bg-[#ea7310] active:scale-95"
                >
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>
      <MobileBottomNav />
    </>
  );
};

export default Navbar;
