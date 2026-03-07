import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingCart, MessageCircle, User, LayoutDashboard } from "lucide-react";
import { useSelector } from "react-redux";

const COMMON_NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, match: (path) => path === "/" },
  { to: "/products", label: "Products", icon: Package, match: (path) => path === "/products" || path.startsWith("/product/") },
  { to: "/cart", label: "Cart", icon: ShoppingCart, match: (path) => path === "/cart" },
  { to: "/feedback", label: "Feedback", icon: MessageCircle, match: (path) => path === "/feedback" || path === "/give-feedback" },
];

const ACCOUNT_NAV_ITEM = { label: "Account", icon: User, match: (path) => path.startsWith("/profile/") || path === "/login" };
const ADMIN_NAV_ITEM = { to: "/admin", label: "Admin", icon: LayoutDashboard, match: (path) => path.startsWith("/admin") };

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.User);

  const accountTo = user ? `/profile/${user._id}` : "/login";
  const isAdmin = user && String(user.role).toLowerCase() === "admin";
  const lastItem = isAdmin ? ADMIN_NAV_ITEM : ACCOUNT_NAV_ITEM;
  const navItems = [...COMMON_NAV_ITEMS, lastItem];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 md:hidden bg-white/60 dark:bg-[#262a30]/60 backdrop-blur-xl border-t border-white/30 dark:border-white/10"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around w-full max-w-[100vw] min-h-[64px] py-2">
        {navItems.map((item) => {
          const to = item.label === "Account" ? accountTo : item.to;
          const isActive = item.match(pathname);
          const Icon = item.icon;

          const content = (
            <>
              {/* Green dot for current section (fixed height so layout doesn't shift) */}
              <div className="flex flex-col items-center justify-end h-5 mb-0.5">
                {isActive ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                ) : null}
              </div>
              <div
                className={`flex flex-col items-center justify-center gap-0.5 ${
                  isActive ? "text-[#2d2d2d]" : "text-gray-600"
                }`}
              >
                <Icon
                  className={`w-6 h-6 shrink-0 ${isActive ? "text-[#2d2d2d]" : "text-gray-600"}`}
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-[11px] font-medium leading-tight tracking-tight">
                  {item.label}
                </span>
              </div>
            </>
          );

          return (
            <Link
              key={item.label + (item.to || "")}
              to={to}
              className="flex-1 flex flex-col items-center justify-start pt-1.5 px-1 min-w-0 active:opacity-80 transition-opacity"
              aria-current={isActive ? "page" : undefined}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
