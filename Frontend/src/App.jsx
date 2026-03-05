import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Verify from "./pages/verify.jsx";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./components/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import SalesAnalytics from "./components/admin/SalesAnalytics";
import UsersManagement from "./components/admin/UsersManagement";
import ProductsManagement from "./components/admin/ProductsManagement";
import OrdersManagement from "./components/admin/OrdersManagement";
import Reports from "./components/admin/Reports";
import AdminLogs from "./pages/AdminLogs";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/verify",
    element: (
      <>
        <Verify />
      </>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <>
        <VerifyEmail />
      </>
    ),
  },
  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Products />
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <>
        <Navbar />
        <Cart />
      </>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "analytics", element: <SalesAnalytics /> },
      { path: "orders", element: <OrdersManagement /> },
      { path: "products", element: <ProductsManagement /> },
      { path: "users", element: <UsersManagement /> },
      { path: "reports", element: <Reports /> },
      { path: "logs", element: <AdminLogs /> },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
