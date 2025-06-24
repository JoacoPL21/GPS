import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import Homepage from "./Homepage/Homepage.jsx";
import Cart from "./Carrito/shopping_cart.jsx";
import Catalogo from "./Catalogo/Catalogo.jsx";
import Productos from "./ProductosManager/ProductosManager.jsx";
import Login from "./User/login.jsx";
import Register from "./User/register.jsx";
import Logout from "./User/logout.jsx";
import Error404 from "./Error404.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";
import Producto from "./Catalogo/Producto.jsx";
import Profile from "./Profile/profile.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: "", element: <Homepage /> },
      { path: "cart", element: <Cart /> },
      { path: "catalogo", element: <Catalogo /> },
      { path: "producto/:id_producto", element: <Producto /> }, 
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "logout", element: <Logout /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "productos",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Productos />
          </ProtectedRoute>
        ),
      },
      {

        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}