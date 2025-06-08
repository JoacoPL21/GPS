import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // se verifica si el usuario tiene un rol permitido 
    // si no se especifican roles permitidos, se permite el acceso

    if (allowedRoles && !allowedRoles.includes(user?.rol)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;