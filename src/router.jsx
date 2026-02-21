import { createHashRouter } from "react-router-dom";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./pages/Home";
import ProductsList from "./pages/ProductsList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import AdminProduct from "./pages/admin/AdminProduct";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <ProductsList />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/admin/product",
    element: <AdminProduct />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
