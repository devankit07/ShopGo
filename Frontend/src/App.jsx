import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import Profile from "./components/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import SalesAnalytics from "./components/admin/SalesAnalytics";
import UsersManagement from "./components/admin/UsersManagement";
import ProductsManagement from "./components/admin/ProductsManagement";
import OrdersManagement from "./components/admin/OrdersManagement";
import AdminLogs from "./pages/AdminLogs";
import Feedback from "./pages/Feedback";
import GiveFeedback from "./pages/GiveFeedback";

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
    path: "/verify-otp",
    element: (
      <>
        <VerifyOTP />
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
    path: "/product/:productId",
    element: (
      <>
        <Navbar />
        <ProductDetail />
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
    path: "/feedback",
    element: (
      <>
        <Navbar />
        <Feedback />
      </>
    ),
  },
  {
    path: "/give-feedback",
    element: (
      <>
        <Navbar />
        <GiveFeedback />
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
