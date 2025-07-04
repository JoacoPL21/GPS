import { createContext, useContext, useState, useEffect } from "react";

// crea un contexto que usaremos para manejar la autenticación
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Recuperar usuario y token al montar
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        setAuthUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        setAuthUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false); // <-- Importante: termina la carga
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,

      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
