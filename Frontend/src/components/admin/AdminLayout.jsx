import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Package,
  Users,
  FileText,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
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
  { path: "/admin/reports", label: "Reports", icon: FileText },
  { path: "/admin/logs", label: "Action Log", icon: ClipboardList },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.User);

  const logout = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.post("http://localhost:8000/api/v1/user/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(setUser(null));
      navigate("/login");
    } catch (_) {}
  };

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }
  if (user?.role !== "admin") {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 shrink-0 bg-[#3E4152] text-white flex flex-col">
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
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
