import { useAuth } from '../../context/AuthContext.jsx';
import DirectionForm from '../Profile/directionForm.jsx';
import { getDireccionesByUserId} from "../../services/user.service.js";
import { useEffect,useState } from 'react';

const Profile = () => {
  const { authUser } = useAuth();
  const id_usuario = authUser?.id_usuario || null;
  const [direcciones, setDirecciones] = useState([]);


  useEffect(() => {
    const fetchDirecciones = async () => {
      console.log('ID de usuario:', id_usuario);
      if (id_usuario) {
        try {
          const response = await getDireccionesByUserId(id_usuario);
          if (response.status === 'Success') {
            setDirecciones(response.data);
          } else {
            console.error('Error al obtener direcciones:', response.message);
          }
        } catch (error) {
          console.error('Error al obtener direcciones:', error);
        }
      }
    }

    fetchDirecciones();
  },  [id_usuario]);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
        <p><strong>Nombre:</strong> {authUser?.nombreCompleto || 'No disponible'}</p>
        <p><strong>Email:</strong> {authUser?.email || 'No disponible'}</p>
        <p><strong>Teléfono:</strong> {authUser?.telefono || 'No disponible'}</p>
      </div>
      <div  className="mt-4 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Direccion de envio</h2>
        {direcciones.length > 0 ? (
          <ul className="list-disc pl-5">
            {direcciones.map((direccion, index) => (
              <li key={index}>
                <p><strong>Calle:</strong> {direccion.calle}</p>
                <p><strong>Número:</strong> {direccion.numero}</p>
                <p><strong>Ciudad:</strong> {direccion.ciudad}</p>
                <p><strong>Región:</strong> {direccion.region}</p>
                <p><strong>Código Postal:</strong> {direccion.codigo_postal}</p>
                <p><strong>Tipo de Dirección:</strong> {direccion.tipo_de_direccion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay direcciones registradas.</p>
        )}
      </div>

      <DirectionForm />
    </div>
  );
};

export default Profile;