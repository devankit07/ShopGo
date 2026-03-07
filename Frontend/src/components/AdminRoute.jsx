import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

const AdminRoute = ({ children }) => {
  const reduxUser = useSelector((state) => state.User?.user);
  const user = reduxUser || getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
