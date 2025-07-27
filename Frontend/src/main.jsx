import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './../src/styles/index.css';
import App from './pages/App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { initializeAuth } from './services/auth.service.js';

// Inicializar la autenticación al cargar la aplicación
initializeAuth();

createRoot(document.getElementById('root')).render(
  
    <CartProvider>  
      <AuthProvider>  
        <App />  
      </AuthProvider>
    </CartProvider>
  
);