import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStoredUser } from "@/lib/authStorage";

const AdminRoute = ({ children }) => {
  const reduxUser = useSelector((state) => state.User?.user);
  const storedUser = getStoredUser();
  // Prefer storage right after login to avoid stale persisted-redux redirects.
  const user = storedUser || reduxUser;
  const normalizedRole = String(user?.role || "")
    .trim()
    .toLowerCase();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (normalizedRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
