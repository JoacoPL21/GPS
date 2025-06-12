import {logout} from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
    const { setIsAuthenticated,setAuthUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                // Actualizar el estado de autenticación
                setIsAuthenticated(false);
                // Limpiar el usuario autenticado
                setAuthUser(null);
                // Redirigir al usuario a la página de inicio o login después de cerrar sesión
                navigate("/");
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        };

        performLogout();
    }, [navigate, setIsAuthenticated, setAuthUser]);

    return null; 
}

export default Logout;