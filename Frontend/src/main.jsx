import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './../src/styles/index.css';
import App from './pages/App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>  {/* Provider del carrito (versión upstream) */}
      <AuthProvider>  {/* Provider de autenticación */}
        <App />  {/* Las rutas ahora están dentro de App.jsx */}
      </AuthProvider>
    </CartProvider>
  </StrictMode>
);