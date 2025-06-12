//pagina de dashboard para el administrador
import { useAuth } from '../../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/user.service.js';

const Dashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        let isMounted = true;
        // Función para obtener todos los usuariosq
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                if (isMounted) setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                if (isMounted) setUsers([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
    
        fetchUsers();
        return () => { isMounted = false; };
    }, [user]);

    if (!user || user.rol !== 'admin') {
        return <Navigate to="/" />;
    }

    if (loading) {
        return <div>Cargando usuarios../</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <h1>Panel de control</h1>
            <h2>Usuarios Registrados</h2>
            <ul>
                {users.map((u) => (
                    <li key={u.id}>{u.nombreCompleto} - {u.email}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;

