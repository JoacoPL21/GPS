import { createContext, useContext,useState } from "react";

// crea un contexto que usaremos para manejar la autenticación
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = {
    authUser,
    setAuthUser,
    isAuthenticated,
    setIsAuthenticated,
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}
