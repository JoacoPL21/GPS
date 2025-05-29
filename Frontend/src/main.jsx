import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Cart from './Carrito/cart.jsx' 
import Productos from './Catalogo/Productos.jsx'
import ProductoInfo from './Catalogo/ProductoInfo.jsx'
import Login from './User/login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductoInfo />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
