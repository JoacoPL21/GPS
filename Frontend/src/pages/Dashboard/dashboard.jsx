//pagina de dashboard para el administrador
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/user.service.js';

const Dashboard = () => {
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        
        let isMounted = true;
        // Función para obtener todos los usuarios
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
    }, [users]);

    
    if (loading) {
        return <div>Cargando usuarios../</div>;
    }

    return (
      <div className="min-h-screen flex flex-col">
        <h1 className="text-2xl font-bold text-center mt-8 mb-8">Dashboard de Administrador</h1>
        <div className="flex flex-1 items-start justify-center">
          <div className="w-full max-w-3xl">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b">{user.id}</td>
                    <td className="py-2 px-4 border-b">{user.nombreCompleto}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.rol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}

export default Dashboard;

