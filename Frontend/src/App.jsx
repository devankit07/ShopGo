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
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <main className="pb-20 md:pb-0">
          <Home />
        </main>
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
        <main className="pb-20 md:pb-0">
          <Products />
        </main>
      </>
    ),
  },
  {
    path: "/product/:productId",
    element: (
      <>
        <Navbar />
        <main className="pb-20 md:pb-0">
          <ProductDetail />
        </main>
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <>
        <Navbar />
        <main className="pb-20 md:pb-0">
          <Cart />
        </main>
      </>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <>
        <Navbar />
        <main className="pb-20 md:pb-0">
          <Profile />
        </main>
      </>
    ),
  },
  {
    path: "/feedback",
    element: (
      <>
        <Navbar />
        <main className="pb-20 md:pb-0">
          <Feedback />
        </main>
      </>
    ),
  },
  {
    path: "/give-feedback",
    element: (
      <>
        <Navbar />
        <main className="pb-20 md:pb-0">
          <GiveFeedback />
        </main>
      </>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "analytics", element: <SalesAnalytics /> },
      { path: "orders", element: <OrdersManagement /> },
      { path: "products", element: <ProductsManagement /> },
      { path: "users", element: <UsersManagement /> },
      { path: "logs", element: <AdminLogs /> },
      { path: "*", element: <NotFound inAdmin /> },
    ],
  },
  {
    path: "*",
    element: (
      <>
        <Navbar />
        <main className="pb-20 md:pb-0">
          <NotFound />
        </main>
      </>
    ),
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
