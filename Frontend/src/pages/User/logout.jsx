import {logout} from "../../services/auth.service";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                // Redirigir al usuario a la página de inicio o login después de cerrar sesión
                navigate("/");
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        };

        performLogout();
    }, [navigate]);

    return null; 
}

export default Logout;