import axios from 'axios';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Función para cerrar sesión automáticamente
const forceLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('cart');
  cookies.remove('jwt-auth');
  
  // Redirigir al login
  window.location.href = '/login';
};

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Verificar si el token está expirado
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          console.log('Token expirado, cerrando sesión...');
          forceLogout();
          return Promise.reject(new Error('Token expirado'));
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Token inválido:', error);
        forceLogout();
        return Promise.reject(error);
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar 401 (token expirado)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Token expirado por el servidor, cerrando sesión...');
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export default instance;