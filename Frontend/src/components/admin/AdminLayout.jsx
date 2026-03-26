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
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userslice";
import axios from "axios";
import { adminApi } from "@/lib/adminApi";

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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const logout = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      await axios.post("/api/v1/user/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
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

  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      try {
        const res = await adminApi.getNotifications();
        if (mounted && res.data?.success) {
          setNotifications(Array.isArray(res.data.notifications) ? res.data.notifications : []);
        }
      } catch {
        // ignore notification fetch errors
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  const activeMenu = menu.find((item) => item.path === location.pathname);
  const activeTitle = activeMenu?.label || "Dashboard";
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMobileMenuClose = () => {
    if (isMobileView) setShowMobileMenu(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      await adminApi.markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item
        )
      );
    } catch {
      // keep silent
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      const res = await adminApi.markAllNotificationsRead();
      if (res.data?.success) {
        setNotifications((prev) =>
          prev.map((item) => ({ ...item, isRead: true }))
        );
      }
    } catch {
      // keep silent
    }
  };

  return (
    <div className="min-h-screen md:flex bg-gray-50">
      <aside
        className={`relative overflow-hidden bg-[#030508] text-white flex flex-col ${
          showMobileMenu ? "w-full min-h-screen" : "hidden"
        } md:flex md:w-64 md:shrink-0 md:min-h-0`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.34]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0px, transparent 11px, rgba(255,255,255,0.07) 11px, rgba(255,255,255,0.07) 12px), repeating-linear-gradient(-45deg, transparent 0px, transparent 11px, rgba(255,255,255,0.07) 11px, rgba(255,255,255,0.07) 12px)",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,rgba(35,52,78,0.38)_0%,#030508_72%)]" aria-hidden />
        <div className="relative z-10 p-6 border-b border-white/10">
          <BrandLogo />
          <p className="text-xs text-white/70 mt-1">Admin Panel</p>
        </div>
        <nav className="relative z-10 flex-1 p-3 space-y-1 overflow-y-auto">
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
        <div className="relative z-10 p-3 border-t border-white/10">
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
        <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
          <div>
            {!isMobileView ? (
              <>
                <h1 className="text-2xl font-bold text-[#3E4152]">{activeTitle}</h1>
                <p className="text-sm text-gray-500">Admin dashboard</p>
              </>
            ) : null}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((v) => !v)}
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-white border border-gray-200 text-[#3E4152] hover:bg-gray-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 ? (
                <span className="absolute top-1.5 right-1.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
              ) : null}
            </button>

            {showNotifications ? (
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#3E4152]">Notifications</p>
                    <p className="text-xs text-gray-500">
                      {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </p>
                  </div>
                  {unreadCount > 0 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      className="shrink-0 text-xs font-semibold text-[#fc8019] underline-offset-2 hover:underline"
                    >
                      Mark all as read
                    </button>
                  ) : null}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-gray-500">No notifications yet.</p>
                  ) : (
                    notifications.map((item) => (
                      <button
                        type="button"
                        key={item._id}
                        onClick={() => markAsRead(item._id)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                          item.isRead ? "bg-white" : "bg-red-50/50 hover:bg-red-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-[#3E4152]">{item.message}</p>
                          {!item.isRead ? (
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-red-500 shrink-0" />
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleString("en-IN")}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
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
