import { createContext, useContext, useState, useEffect } from "react";
import { isTokenValid, getCurrentUser, initializeAuth, getUserProfile } from "../services/auth.service.js";

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

  // Función para actualizar el perfil del usuario
  const refreshUserProfile = async () => {
    try {
      const result = await getUserProfile();
      if (result.status === 'Success') {
        setAuthUser(result.data);
        return result.data;
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
    return null;
  };

  // Función para verificar si el token sigue siendo válido
  const checkTokenValidity = () => {
    if (!isTokenValid()) {
      setAuthUser(null);
      setIsAuthenticated(false);
      return false;
    }
    return true;
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
        refreshUserProfile,
        checkTokenValidity,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
