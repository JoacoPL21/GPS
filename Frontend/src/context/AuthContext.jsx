import { createContext, useContext, useState, useEffect } from "react";
import { isTokenValid, getCurrentUser, initializeAuth } from "../services/auth.service.js";

// crea un contexto que usaremos para manejar la autenticación
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Recuperar usuario y token al montar, verificando validez del token
  useEffect(() => {
    // Intentar inicializar la autenticación
    const isValidAuth = initializeAuth();
    
    if (isValidAuth) {
      const user = getCurrentUser();
      if (user) {
        setAuthUser(user);
        setIsAuthenticated(true);
      }
    } else {
      // Token inválido o expirado
      setAuthUser(null);
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);



  // Función para verificar si el token sigue siendo válido
  const checkTokenValidity = () => {
    if (!isTokenValid()) {
      setAuthUser(null);
      setIsAuthenticated(false);
      return false;
    }
    return true;
  };

  // Función para actualizar los datos del usuario
  const updateUser = (updatedUserData) => {
    setAuthUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
    
    // También actualizar el localStorage manteniendo campos importantes
    try {
      const currentUserData = JSON.parse(localStorage.getItem('usuario') || '{}');
      const newUserData = { 
        ...currentUserData, 
        ...updatedUserData,
        // Asegurar que se mantengan campos importantes si no vienen en la actualización
        createdAt: updatedUserData.createdAt || currentUserData.createdAt,
        id: updatedUserData.id || currentUserData.id
      };
      localStorage.setItem('usuario', JSON.stringify(newUserData));
    } catch (error) {
      console.error('Error updating user in localStorage:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
        checkTokenValidity,
        updateUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
