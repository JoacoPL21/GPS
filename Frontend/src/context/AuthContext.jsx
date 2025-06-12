import { createContext, useContext, useState, useEffect } from "react";

// crea un contexto que usaremos para manejar la autenticación
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Recuperar usuario y token al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if ( token) {
      try {
        setIsAuthenticated(true);
      } catch (e) {
        setAuthUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        console.error("Error al recuperar el usuario autenticado:", e);
      }
    }
  }, []);

  const value = {
    authUser,
    setAuthUser,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}
