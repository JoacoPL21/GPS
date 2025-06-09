import { createContext, useContext, } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  //obtiene info del sessionStorage
  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const isAuthenticated = user ? true : false;



  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}