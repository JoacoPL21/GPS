import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './../src/styles/index.css'
import App from './pages/App.jsx'
import Cart from './pages/Carrito/shopping_cart.jsx' 
import Productos from './pages/Catalogo/Productos.jsx'
import ProductoInfo from './pages/Catalogo/ProductoInfo.jsx'
import Login from './pages/User/login.jsx'
import Error404 from './pages/Error404.jsx'
import Register from './pages/User/register.jsx' // Assuming you have a register component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductoInfo />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/register" element={<Register />} /> {/* Assuming you want to use the same component for registration */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
