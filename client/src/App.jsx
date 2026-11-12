import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./Pages/Home.jsx";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import Products from "./Pages/Products.jsx";
import Cart from "./Pages/Cart.jsx";
import ProductDetail from "./Pages/ProductDetails.jsx";
import Profile from "./Pages/Profile.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import Checkout from "./Pages/Checkout.jsx";

import { AuthProvider } from "./context/authContext";
import { CartContextProvider } from "./context/cartContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/sign-up", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/products", element: <Products /> },
  { path: "/products/:id", element: <ProductDetail /> },
  {
    element: <ProtectedRoute allowedRoles={["customer"]} />,
    children: [
      { path: "/profile", element: <Profile /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [{ path: "/admin", element: <AdminDashboard /> }],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </CartContextProvider>
    </AuthProvider>
  );
}
