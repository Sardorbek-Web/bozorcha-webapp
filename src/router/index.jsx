import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import CatalogPage from "../pages/CatalogPage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import FavoritesPage from "../pages/FavoritesPage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import OrdersPage from "../pages/OrdersPage";
import CheckoutPage from "../pages/CheckoutPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "catalog", element: <CatalogPage /> },
      { path: "product/:id", element: <ProductPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "profile/edit", element: <EditProfilePage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "checkout", element: <CheckoutPage /> },
    ],
  },
  {
    path: "/admin-login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboardPage />,
  },
]);