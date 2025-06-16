import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./../src/styles/index.css";
import App from "./pages/App.jsx";
import Cart from "./pages/Carrito/shopping_cart.jsx";
import Catalogo from "./pages/Catalogo/Catalogo.jsx";
import Producto from "./pages/Catalogo/Producto.jsx";
import Login from "./pages/User/login.jsx";
import Error404 from "./pages/Error404.jsx";
import Register from "./pages/User/register.jsx"; //
import Logout from "./pages/User/logout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import { CarritoProvider } from "./components/CartProvider.jsx";

import SuccessPage from "./pages/Carrito/success.jsx";
import FailurePage from "./pages/Carrito/failure.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id_producto" element={<Producto />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error404 />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/failure" element={<FailurePage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
