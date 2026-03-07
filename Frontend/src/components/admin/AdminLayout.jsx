import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Package,
  Users,
  ClipboardList,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userslice";
import axios from "axios";

const BrandLogo = () => (
  <Link to="/" className="inline-block">
    <img src="/icon.png" alt="SHOP-GO" className="h-8 w-auto object-contain" />
  </Link>
);

const menu = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/analytics", label: "Sales Analytics", icon: BarChart3 },
  { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/logs", label: "Action Log", icon: ClipboardList },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileView, setIsMobileView] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768 && location.pathname === "/admin"
  );

  const logout = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.post("http://localhost:8000/api/v1/user/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(setUser(null));
      localStorage.removeItem("user");
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
      navigate("/login");
    } catch (_) {}
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleViewportChange = () => setIsMobileView(mediaQuery.matches);
    handleViewportChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleViewportChange);
      return () => mediaQuery.removeEventListener("change", handleViewportChange);
    }

    mediaQuery.addListener(handleViewportChange);
    return () => mediaQuery.removeListener(handleViewportChange);
  }, []);

  useEffect(() => {
    if (!isMobileView) {
      setShowMobileMenu(false);
    }
  }, [isMobileView]);

  const activeMenu = menu.find((item) => item.path === location.pathname);
  const activeTitle = activeMenu?.label || "Dashboard";

  const handleMobileMenuClose = () => {
    if (isMobileView) setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen md:flex bg-gray-50">
      <aside
        className={`bg-[#3E4152] text-white flex flex-col ${
          showMobileMenu ? "w-full min-h-screen" : "hidden"
        } md:flex md:w-64 md:shrink-0 md:min-h-0`}
      >
        <div className="p-6 border-b border-white/10">
          <BrandLogo />
          <p className="text-xs text-white/70 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMobileMenuClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-[var(--brand-accent)] text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <main className={`flex-1 overflow-auto ${showMobileMenu ? "hidden md:block" : "block"} p-4 md:p-8`}>
        {isMobileView && !showMobileMenu ? (
          <button
            type="button"
            onClick={() => setShowMobileMenu(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3E4152] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </button>
        ) : null}
        {isMobileView && !showMobileMenu ? <p className="text-xs text-gray-500 mb-4">{activeTitle}</p> : null}
        <Outlet />
      </main>
    </div>
  );
}
