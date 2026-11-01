import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./Pages/Home.jsx";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import Products from "./Pages/Products.jsx";
import Cart from "./Pages/Cart.jsx";
import ProductDetail from "./Pages/ProductDetails.jsx";
import Profile from "./Pages/Profile.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/productdetails",
    element: <ProductDetail />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </>
  );
}

export default App;