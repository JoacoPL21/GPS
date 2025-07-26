import './../styles/App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import Homepage from "./Homepage/Homepage.jsx";
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
import SuccessPage from './Carrito/success.jsx';
import FailurePage from './Carrito/failure.jsx';
import MultiStepCart from './Carrito/multi-step-cart.jsx';
import MisCompras from "./Profile/MisCompras.jsx";
import MisPedidos from "./Profile/MisPedidos.jsx";
import GestionDestacados from "../components/GestionDestacados.jsx";
import Valoraciones from "./Profile/Valoraciones.jsx";
import AdminCompras from "./Dashboard/AdminCompras.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: "", element: <Homepage /> },
      { path: "cart", element: <MultiStepCart /> },
      { path: "catalogo", element: <Catalogo /> },
      { path: "producto/:id_producto", element: <Producto /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "logout", element: <Logout /> },
      { path: "success", element: <SuccessPage /> },
      { path: "failure", element: <FailurePage /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/admin-compras",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCompras />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestiondestac",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <GestionDestacados />
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
      {
        path: "profile/mis-compras",
        element: (
          <ProtectedRoute>
            <MisCompras />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/valoraciones",
        element: (
          <ProtectedRoute>
            <Valoraciones />
          </ProtectedRoute>
        ),
      },

      {
        path: "profile/mis-pedidos",
        element: (
          <ProtectedRoute>
            <MisPedidos />
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